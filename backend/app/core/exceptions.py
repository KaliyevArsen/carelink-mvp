"""Custom exception classes."""

from typing import Any, Optional


class CareLinkeException(Exception):
    """Base exception for CareLink application."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class AuthenticationError(CareLinkeException):
    """Authentication failed."""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message=message, status_code=401)


class AuthorizationError(CareLinkeException):
    """User not authorized for this action."""

    def __init__(self, message: str = "Not authorized"):
        super().__init__(message=message, status_code=403)


class NotFoundError(CareLinkeException):
    """Resource not found."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)


class ValidationError(CareLinkeException):
    """Validation error."""

    def __init__(self, message: str = "Validation error", details: Optional[dict] = None):
        super().__init__(message=message, status_code=422, details=details)
