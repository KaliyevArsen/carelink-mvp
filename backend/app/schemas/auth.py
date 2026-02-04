"""Authentication schemas."""

from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Login request schema."""

    email: EmailStr
    password: str


class OrganizationInfo(BaseModel):
    """Organization info embedded in auth responses."""

    id: UUID
    name: str

    class Config:
        from_attributes = True


class UserInfo(BaseModel):
    """User info embedded in auth responses."""

    id: UUID
    email: str
    full_name: str
    role: str
    organization: OrganizationInfo

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Login response with token and user info."""

    token: str
    user: UserInfo


class TokenRefreshRequest(BaseModel):
    """Token refresh request."""

    token: str


class TokenRefreshResponse(BaseModel):
    """Token refresh response."""

    token: str
