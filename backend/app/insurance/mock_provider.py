"""Mock insurance provider for MVP testing and demos."""

import asyncio
import hashlib
import random
import time
from datetime import date, timedelta
from typing import Optional

from app.config import get_settings
from app.insurance.base import InsuranceProvider, EligibilityResult
from app.insurance.mock_data import (
    INSURANCE_COMPANIES,
    PLAN_TYPES,
    PLAN_NAMES,
    COPAY_RANGES,
    DEDUCTIBLES_INDIVIDUAL,
    DEDUCTIBLES_FAMILY,
    OOP_MAX_INDIVIDUAL,
    OOP_MAX_FAMILY,
    COINSURANCE_RATES,
    RELATIONSHIPS,
    ERROR_MESSAGES,
    FIRST_NAMES,
    LAST_NAMES,
)


class MockInsuranceProvider(InsuranceProvider):
    """Mock insurance provider that simulates realistic API behavior.

    Features:
    - Deterministic responses based on member ID (same ID = same response)
    - Configurable response delays to simulate real API latency
    - Configurable error rate for testing error handling
    - Realistic coverage data with variety
    """

    def __init__(self):
        self.settings = get_settings()

    def _get_deterministic_seed(self, member_id: str, insurance_company: str) -> int:
        """Generate a deterministic seed from member ID and insurance company.

        This ensures the same member ID always returns the same data,
        making demos reproducible and testing predictable.
        """
        combined = f"{member_id}:{insurance_company}"
        hash_bytes = hashlib.sha256(combined.encode()).digest()
        return int.from_bytes(hash_bytes[:4], byteorder="big")

    def _select_from_list(self, items: list, seed: int, offset: int = 0) -> any:
        """Deterministically select an item from a list based on seed."""
        index = (seed + offset) % len(items)
        return items[index]

    def _generate_coverage_data(
        self,
        seed: int,
        insurance_company: str,
    ) -> dict:
        """Generate realistic coverage data based on seed."""
        # Select plan type and name
        plan_type = self._select_from_list(PLAN_TYPES, seed, 0)
        plan_name = self._select_from_list(PLAN_NAMES[plan_type], seed, 1)

        # Generate effective date (between 1-3 years ago)
        days_ago = (seed % 1000) + 365  # 1-3 years ago
        effective_date = date.today() - timedelta(days=days_ago)

        # Generate copays
        copay_primary = self._select_from_list(COPAY_RANGES["primary_care"], seed, 2)
        copay_specialist = self._select_from_list(COPAY_RANGES["specialist"], seed, 3)
        copay_urgent = self._select_from_list(COPAY_RANGES["urgent_care"], seed, 4)
        copay_emergency = self._select_from_list(COPAY_RANGES["emergency"], seed, 5)

        # Generate deductibles
        deductible_individual = self._select_from_list(DEDUCTIBLES_INDIVIDUAL, seed, 6)
        deductible_family = self._select_from_list(DEDUCTIBLES_FAMILY, seed, 7)

        # Generate deductible met amount (0-100% of deductible)
        deductible_met_pct = (seed % 100) / 100
        deductible_met = round(deductible_individual * deductible_met_pct, 2)

        # Generate out of pocket max
        oop_max_individual = self._select_from_list(OOP_MAX_INDIVIDUAL, seed, 8)
        oop_max_family = self._select_from_list(OOP_MAX_FAMILY, seed, 9)

        # Generate OOP met amount (0-50% of max typically)
        oop_met_pct = (seed % 50) / 100
        oop_met = round(oop_max_individual * oop_met_pct, 2)

        # Coinsurance
        coinsurance = self._select_from_list(COINSURANCE_RATES, seed, 10)

        return {
            "effective_date": effective_date.isoformat(),
            "termination_date": None,
            "plan_name": plan_name,
            "plan_type": plan_type,
            "copay_primary_care": f"₸{copay_primary:,}",
            "copay_specialist": f"₸{copay_specialist:,}",
            "copay_urgent_care": f"₸{copay_urgent:,}",
            "copay_emergency": f"₸{copay_emergency:,}",
            "deductible_individual": f"₸{deductible_individual:,}",
            "deductible_family": f"₸{deductible_family:,}",
            "deductible_met": f"₸{deductible_met:,.0f}",
            "out_of_pocket_max": f"₸{oop_max_individual:,}",
            "out_of_pocket_max_family": f"₸{oop_max_family:,}",
            "out_of_pocket_met": f"₸{oop_met:,.0f}",
            "coinsurance": coinsurance,
        }

    def _generate_subscriber_data(
        self,
        seed: int,
        member_id: str,
        patient_first_name: str,
        patient_last_name: str,
    ) -> dict:
        """Generate subscriber data."""
        # Determine relationship - 70% Self, 20% Spouse, 10% Child
        relationship_roll = seed % 100
        if relationship_roll < 70:
            relationship = "Self"
            name = f"{patient_first_name} {patient_last_name}"
        elif relationship_roll < 90:
            relationship = "Spouse"
            # Generate a different first name for spouse
            first_name = self._select_from_list(FIRST_NAMES, seed, 20)
            name = f"{first_name} {patient_last_name}"
        else:
            relationship = "Child"
            name = f"{patient_first_name} {patient_last_name}"

        return {
            "name": name,
            "relationship": relationship,
            "member_id": member_id,
        }

    def _should_simulate_error(self, seed: int) -> tuple[bool, Optional[str]]:
        """Determine if this request should simulate an error.

        Returns:
            Tuple of (should_error, error_type)
        """
        # Use a different part of the seed to determine errors
        error_roll = (seed >> 8) % 1000  # 0-999

        # 3% chance of "not found"
        if error_roll < 30:
            return True, "not_found"

        # 2% chance of "service unavailable"
        if error_roll < 50:
            return True, "service_unavailable"

        return False, None

    def _should_be_inactive(self, seed: int) -> bool:
        """Determine if this policy should be inactive (5% chance)."""
        inactive_roll = (seed >> 16) % 100
        return inactive_roll < 5

    async def _simulate_delay(self) -> int:
        """Simulate API latency and return delay in milliseconds."""
        min_delay = self.settings.MOCK_API_MIN_DELAY_MS
        max_delay = self.settings.MOCK_API_MAX_DELAY_MS
        delay_ms = random.randint(min_delay, max_delay)
        await asyncio.sleep(delay_ms / 1000)
        return delay_ms

    async def check_eligibility(
        self,
        patient_first_name: str,
        patient_last_name: str,
        patient_dob: date,
        insurance_company: str,
        member_id: str,
        group_number: Optional[str] = None,
    ) -> EligibilityResult:
        """Check insurance eligibility (mock implementation).

        Returns deterministic results based on member_id to ensure
        consistent behavior for demos and testing.
        """
        start_time = time.time()

        # Simulate API delay
        simulated_delay = await self._simulate_delay()

        # Get deterministic seed
        seed = self._get_deterministic_seed(member_id, insurance_company)

        # Check for simulated errors
        should_error, error_type = self._should_simulate_error(seed)
        if should_error:
            error_messages = ERROR_MESSAGES[error_type]
            error_msg = self._select_from_list(error_messages, seed, 100)

            return EligibilityResult(
                status="error" if error_type == "service_unavailable" else "not_found",
                error_message=error_msg,
                response_time_ms=simulated_delay,
            )

        # Check for inactive policy
        if self._should_be_inactive(seed):
            # Generate termination date in the past
            days_ago = (seed % 180) + 30  # 1-7 months ago
            termination_date = date.today() - timedelta(days=days_ago)

            coverage = self._generate_coverage_data(seed, insurance_company)
            coverage["termination_date"] = termination_date.isoformat()

            return EligibilityResult(
                status="inactive",
                coverage=coverage,
                subscriber=self._generate_subscriber_data(
                    seed, member_id, patient_first_name, patient_last_name
                ),
                response_time_ms=simulated_delay,
            )

        # Generate successful response
        coverage = self._generate_coverage_data(seed, insurance_company)
        subscriber = self._generate_subscriber_data(
            seed, member_id, patient_first_name, patient_last_name
        )

        return EligibilityResult(
            status="active",
            coverage=coverage,
            subscriber=subscriber,
            response_time_ms=simulated_delay,
        )

    def get_supported_insurers(self) -> list[str]:
        """Get list of supported insurance companies."""
        return INSURANCE_COMPANIES.copy()
