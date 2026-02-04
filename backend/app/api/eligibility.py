"""Eligibility check API endpoints."""

from datetime import date
from typing import Optional
from uuid import UUID
import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.eligibility import (
    EligibilityCheckRequest,
    EligibilityCheckResponse,
    EligibilityHistoryResponse,
    EligibilityHistoryItem,
    CoverageInfo,
    SubscriberInfo,
    PaginationInfo,
)
from app.services.eligibility_service import EligibilityService
from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/check", response_model=EligibilityCheckResponse)
async def check_eligibility(
    request: EligibilityCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EligibilityCheckResponse:
    """Perform a real-time insurance eligibility verification.

    This endpoint checks a patient's insurance eligibility and returns
    coverage details including copays, deductibles, and out-of-pocket maximums.
    """
    service = EligibilityService(db)

    check = await service.check_eligibility(
        user=current_user,
        patient_first_name=request.patient_first_name,
        patient_last_name=request.patient_last_name,
        patient_dob=request.patient_dob,
        insurance_company=request.insurance_company,
        member_id=request.member_id,
        group_number=request.group_number,
    )

    # Build response
    response_data = check.response_data or {}
    coverage_data = response_data.get("coverage")
    subscriber_data = response_data.get("subscriber")

    return EligibilityCheckResponse(
        id=check.id,
        status=response_data.get("status", "error"),
        coverage=CoverageInfo(**coverage_data) if coverage_data else None,
        subscriber=SubscriberInfo(**subscriber_data) if subscriber_data else None,
        error_message=check.error_message,
        response_time_ms=check.response_time_ms,
        created_at=check.created_at,
    )


@router.get("/history", response_model=EligibilityHistoryResponse)
async def get_eligibility_history(
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=50, ge=1, le=100, description="Items per page"),
    start_date: Optional[date] = Query(default=None, description="Filter by start date"),
    end_date: Optional[date] = Query(default=None, description="Filter by end date"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EligibilityHistoryResponse:
    """Retrieve eligibility check history for the user's organization.

    Results are paginated and can be filtered by date range.
    """
    service = EligibilityService(db)

    checks, total = service.get_history(
        user=current_user,
        page=page,
        limit=limit,
        start_date=start_date,
        end_date=end_date,
    )

    # Convert to response items
    items = [
        EligibilityHistoryItem(
            id=check.id,
            patient_first_name=check.patient_first_name,
            patient_last_name=check.patient_last_name,
            patient_dob=check.patient_dob,
            insurance_company=check.insurance_company,
            member_id=check.member_id,
            group_number=check.group_number,
            status=check.response_data.get("status", "error") if check.response_data else "error",
            response_data=check.response_data,
            error_message=check.error_message,
            response_time_ms=check.response_time_ms,
            created_at=check.created_at,
        )
        for check in checks
    ]

    return EligibilityHistoryResponse(
        data=items,
        pagination=PaginationInfo(
            page=page,
            limit=limit,
            total=total,
            pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.get("/{check_id}", response_model=EligibilityCheckResponse)
async def get_eligibility_check(
    check_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EligibilityCheckResponse:
    """Get details of a specific eligibility check."""
    service = EligibilityService(db)

    check = service.get_check_by_id(user=current_user, check_id=check_id)
    if not check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility check not found",
        )

    response_data = check.response_data or {}
    coverage_data = response_data.get("coverage")
    subscriber_data = response_data.get("subscriber")

    return EligibilityCheckResponse(
        id=check.id,
        status=response_data.get("status", "error"),
        coverage=CoverageInfo(**coverage_data) if coverage_data else None,
        subscriber=SubscriberInfo(**subscriber_data) if subscriber_data else None,
        error_message=check.error_message,
        response_time_ms=check.response_time_ms,
        created_at=check.created_at,
    )


@router.get("/insurers/list", response_model=list[str])
async def list_supported_insurers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[str]:
    """Get list of supported insurance companies."""
    service = EligibilityService(db)
    return service.get_supported_insurers()
