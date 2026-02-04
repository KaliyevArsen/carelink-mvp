"""Eligibility check schemas."""

from datetime import date, datetime
from typing import Optional, Any
from uuid import UUID

from pydantic import BaseModel, Field


class EligibilityCheckRequest(BaseModel):
    """Request schema for eligibility check."""

    patient_first_name: str = Field(min_length=1, max_length=100)
    patient_last_name: str = Field(min_length=1, max_length=100)
    patient_dob: date
    insurance_company: str = Field(min_length=1, max_length=255)
    member_id: str = Field(min_length=1, max_length=50)
    group_number: Optional[str] = Field(default=None, max_length=50)


class CoverageInfo(BaseModel):
    """Coverage information in eligibility response."""

    effective_date: Optional[str] = None
    termination_date: Optional[str] = None
    plan_name: Optional[str] = None
    plan_type: Optional[str] = None
    copay_primary_care: Optional[str] = None
    copay_specialist: Optional[str] = None
    copay_urgent_care: Optional[str] = None
    copay_emergency: Optional[str] = None
    deductible_individual: Optional[str] = None
    deductible_family: Optional[str] = None
    deductible_met: Optional[str] = None
    out_of_pocket_max: Optional[str] = None
    out_of_pocket_met: Optional[str] = None
    coinsurance: Optional[str] = None


class SubscriberInfo(BaseModel):
    """Subscriber information in eligibility response."""

    name: Optional[str] = None
    relationship: Optional[str] = None
    member_id: Optional[str] = None


class EligibilityCheckResponse(BaseModel):
    """Response schema for eligibility check."""

    id: UUID
    status: str  # active, inactive, error
    coverage: Optional[CoverageInfo] = None
    subscriber: Optional[SubscriberInfo] = None
    error_message: Optional[str] = None
    response_time_ms: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EligibilityHistoryItem(BaseModel):
    """Single item in eligibility history."""

    id: UUID
    patient_first_name: str
    patient_last_name: str
    patient_dob: date
    insurance_company: str
    member_id: str
    group_number: Optional[str] = None
    status: str
    response_data: Optional[dict[str, Any]] = None
    error_message: Optional[str] = None
    response_time_ms: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginationInfo(BaseModel):
    """Pagination metadata."""

    page: int
    limit: int
    total: int
    pages: int


class EligibilityHistoryResponse(BaseModel):
    """Response schema for eligibility history."""

    data: list[EligibilityHistoryItem]
    pagination: PaginationInfo
