"""Eligibility check model."""

import enum
import uuid
from datetime import datetime, date

from sqlalchemy import Column, String, Text, Integer, Date, Enum, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.database import Base


class EligibilityStatus(str, enum.Enum):
    """Eligibility check status."""

    PENDING = "pending"
    SUCCESS = "success"
    ERROR = "error"


class EligibilityCheck(Base):
    """Eligibility check model for tracking insurance verification requests."""

    __tablename__ = "eligibility_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True
    )

    # Patient information
    patient_first_name = Column(String(100), nullable=False)
    patient_last_name = Column(String(100), nullable=False)
    patient_dob = Column(Date, nullable=False)

    # Insurance information
    insurance_company = Column(String(255), nullable=False)
    member_id = Column(String(50), nullable=False, index=True)
    group_number = Column(String(50), nullable=True)

    # Result data
    status = Column(Enum(EligibilityStatus), default=EligibilityStatus.PENDING)
    response_data = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    response_time_ms = Column(Integer, nullable=True)

    # Timestamps
    created_at = Column(
        DateTime, default=datetime.utcnow, nullable=False, index=True
    )

    # Relationships
    user = relationship("User", back_populates="eligibility_checks")
    organization = relationship("Organization", back_populates="eligibility_checks")

    def __repr__(self) -> str:
        return f"<EligibilityCheck {self.member_id} - {self.status}>"
