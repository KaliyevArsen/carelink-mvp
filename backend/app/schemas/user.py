"""User schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserCreate(BaseModel):
    """Schema for creating a new user."""

    email: EmailStr
    password: str = Field(min_length=12)
    full_name: str = Field(min_length=1, max_length=255)
    role: UserRole = UserRole.STAFF


class UserUpdate(BaseModel):
    """Schema for updating a user."""

    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class OrganizationBasic(BaseModel):
    """Basic organization info for user response."""

    id: UUID
    name: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """User response schema."""

    id: UUID
    email: str
    full_name: str
    role: UserRole
    organization: OrganizationBasic
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    """User schema with password hash (for internal use)."""

    password_hash: str
