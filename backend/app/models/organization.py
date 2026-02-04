"""Organization model."""

import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class SubscriptionTier(str, enum.Enum):
    """Subscription tier levels."""

    TRIAL = "trial"
    BASIC = "basic"
    PROFESSIONAL = "professional"


class OrganizationType(str, enum.Enum):
    """Organization type."""

    CLINIC = "clinic"
    HOSPITAL = "hospital"
    URGENT_CARE = "urgent_care"


class Organization(Base):
    """Organization model representing a healthcare provider."""

    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type = Column(Enum(OrganizationType), default=OrganizationType.CLINIC)
    npi_number = Column(String(10), unique=True, nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(20), nullable=True)
    subscription_tier = Column(
        Enum(SubscriptionTier), default=SubscriptionTier.TRIAL
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    users = relationship("User", back_populates="organization")
    eligibility_checks = relationship("EligibilityCheck", back_populates="organization")

    def __repr__(self) -> str:
        return f"<Organization {self.name}>"
