"""Factory for creating insurance provider instances."""

from functools import lru_cache

from app.config import get_settings
from app.insurance.base import InsuranceProvider
from app.insurance.mock_provider import MockInsuranceProvider


@lru_cache()
def get_insurance_provider() -> InsuranceProvider:
    """Get the configured insurance provider.

    The provider type is determined by the INSURANCE_PROVIDER environment variable.
    Currently supported:
    - "mock": MockInsuranceProvider for testing and demos

    Future providers (post-MVP):
    - "availity": AvailityProvider for real eligibility checks
    - "change_healthcare": ChangeHealthcareProvider

    Returns:
        InsuranceProvider instance
    """
    settings = get_settings()
    provider_type = settings.INSURANCE_PROVIDER.lower()

    if provider_type == "mock":
        return MockInsuranceProvider()

    # Future: Add real provider implementations here
    # elif provider_type == "availity":
    #     return AvailityProvider()
    # elif provider_type == "change_healthcare":
    #     return ChangeHealthcareProvider()

    # Default to mock
    return MockInsuranceProvider()
