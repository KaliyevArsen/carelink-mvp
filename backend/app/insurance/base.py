"""Abstract base class for insurance providers."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Optional, Any


@dataclass
class EligibilityResult:
    """Result of an eligibility check."""

    status: str  # active, inactive, error, not_found
    coverage: Optional[dict[str, Any]] = None
    subscriber: Optional[dict[str, Any]] = None
    error_message: Optional[str] = None
    response_time_ms: int = 0


class InsuranceProvider(ABC):
    """Abstract base class for insurance providers.

    This interface allows easy swapping between mock and real providers.
    To add a real provider (e.g., Availity), create a new class that
    inherits from this base class and implements check_eligibility.
    """

    @abstractmethod
    async def check_eligibility(
        self,
        patient_first_name: str,
        patient_last_name: str,
        patient_dob: date,
        insurance_company: str,
        member_id: str,
        group_number: Optional[str] = None,
    ) -> EligibilityResult:
        """Check insurance eligibility for a patient.

        Args:
            patient_first_name: Patient's first name
            patient_last_name: Patient's last name
            patient_dob: Patient's date of birth
            insurance_company: Name of the insurance company
            member_id: Insurance member ID
            group_number: Optional insurance group number

        Returns:
            EligibilityResult with status and coverage details
        """
        pass

    @abstractmethod
    def get_supported_insurers(self) -> list[str]:
        """Get list of supported insurance companies."""
        pass
