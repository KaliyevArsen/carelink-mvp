"""Eligibility check service with caching."""

import json
from datetime import date
from typing import Optional
from uuid import UUID

import redis
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.eligibility import EligibilityCheck, EligibilityStatus
from app.models.user import User
from app.insurance import get_insurance_provider, EligibilityResult


class EligibilityService:
    """Service for performing and caching eligibility checks."""

    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()
        self.provider = get_insurance_provider()
        self._redis: Optional[redis.Redis] = None

    @property
    def redis_client(self) -> Optional[redis.Redis]:
        """Lazy initialization of Redis client."""
        if self._redis is None:
            try:
                self._redis = redis.from_url(
                    self.settings.REDIS_URL,
                    decode_responses=True,
                )
                # Test connection
                self._redis.ping()
            except redis.ConnectionError:
                # Redis not available, continue without caching
                self._redis = None
        return self._redis

    def _get_cache_key(
        self,
        insurance_company: str,
        member_id: str,
        patient_dob: date,
    ) -> str:
        """Generate cache key for eligibility check."""
        return f"eligibility:{insurance_company}:{member_id}:{patient_dob.isoformat()}"

    def _get_cached_result(
        self,
        insurance_company: str,
        member_id: str,
        patient_dob: date,
    ) -> Optional[dict]:
        """Get cached eligibility result if available."""
        if not self.redis_client:
            return None

        cache_key = self._get_cache_key(insurance_company, member_id, patient_dob)
        cached = self.redis_client.get(cache_key)

        if cached:
            return json.loads(cached)
        return None

    def _cache_result(
        self,
        insurance_company: str,
        member_id: str,
        patient_dob: date,
        result: dict,
    ) -> None:
        """Cache eligibility result."""
        if not self.redis_client:
            return

        cache_key = self._get_cache_key(insurance_company, member_id, patient_dob)
        self.redis_client.setex(
            cache_key,
            self.settings.ELIGIBILITY_CACHE_TTL,
            json.dumps(result),
        )

    async def check_eligibility(
        self,
        user: User,
        patient_first_name: str,
        patient_last_name: str,
        patient_dob: date,
        insurance_company: str,
        member_id: str,
        group_number: Optional[str] = None,
    ) -> EligibilityCheck:
        """Perform eligibility check with caching.

        Args:
            user: The user performing the check
            patient_first_name: Patient's first name
            patient_last_name: Patient's last name
            patient_dob: Patient's date of birth
            insurance_company: Insurance company name
            member_id: Insurance member ID
            group_number: Optional group number

        Returns:
            EligibilityCheck record with results
        """
        # Check cache first
        cached_result = self._get_cached_result(
            insurance_company, member_id, patient_dob
        )

        if cached_result:
            # Create record with cached data
            eligibility_check = EligibilityCheck(
                user_id=user.id,
                organization_id=user.organization_id,
                patient_first_name=patient_first_name,
                patient_last_name=patient_last_name,
                patient_dob=patient_dob,
                insurance_company=insurance_company,
                member_id=member_id,
                group_number=group_number,
                status=EligibilityStatus(cached_result["status"]),
                response_data=cached_result,
                response_time_ms=0,  # Cached response
            )
        else:
            # Perform actual eligibility check
            result: EligibilityResult = await self.provider.check_eligibility(
                patient_first_name=patient_first_name,
                patient_last_name=patient_last_name,
                patient_dob=patient_dob,
                insurance_company=insurance_company,
                member_id=member_id,
                group_number=group_number,
            )

            # Map result status to database enum
            if result.status == "active":
                db_status = EligibilityStatus.SUCCESS
            elif result.status in ("inactive", "not_found"):
                db_status = EligibilityStatus.SUCCESS  # Still a successful check
            else:
                db_status = EligibilityStatus.ERROR

            # Build response data
            response_data = {
                "status": result.status,
                "coverage": result.coverage,
                "subscriber": result.subscriber,
            }

            # Create eligibility check record
            eligibility_check = EligibilityCheck(
                user_id=user.id,
                organization_id=user.organization_id,
                patient_first_name=patient_first_name,
                patient_last_name=patient_last_name,
                patient_dob=patient_dob,
                insurance_company=insurance_company,
                member_id=member_id,
                group_number=group_number,
                status=db_status,
                response_data=response_data,
                error_message=result.error_message,
                response_time_ms=result.response_time_ms,
            )

            # Cache successful results
            if result.status in ("active", "inactive"):
                self._cache_result(
                    insurance_company,
                    member_id,
                    patient_dob,
                    response_data,
                )

        # Save to database
        self.db.add(eligibility_check)
        self.db.commit()
        self.db.refresh(eligibility_check)

        return eligibility_check

    def get_history(
        self,
        user: User,
        page: int = 1,
        limit: int = 50,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> tuple[list[EligibilityCheck], int]:
        """Get eligibility check history for user's organization.

        Args:
            user: The requesting user
            page: Page number (1-indexed)
            limit: Items per page
            start_date: Filter by start date
            end_date: Filter by end date

        Returns:
            Tuple of (checks list, total count)
        """
        query = self.db.query(EligibilityCheck).filter(
            EligibilityCheck.organization_id == user.organization_id
        )

        if start_date:
            query = query.filter(EligibilityCheck.created_at >= start_date)

        if end_date:
            query = query.filter(EligibilityCheck.created_at <= end_date)

        # Get total count
        total = query.count()

        # Apply pagination
        offset = (page - 1) * limit
        checks = (
            query.order_by(EligibilityCheck.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

        return checks, total

    def get_check_by_id(
        self,
        user: User,
        check_id: UUID,
    ) -> Optional[EligibilityCheck]:
        """Get a specific eligibility check by ID.

        Args:
            user: The requesting user
            check_id: Eligibility check ID

        Returns:
            EligibilityCheck if found and belongs to user's org, else None
        """
        return (
            self.db.query(EligibilityCheck)
            .filter(
                EligibilityCheck.id == check_id,
                EligibilityCheck.organization_id == user.organization_id,
            )
            .first()
        )

    def get_supported_insurers(self) -> list[str]:
        """Get list of supported insurance companies."""
        return self.provider.get_supported_insurers()
