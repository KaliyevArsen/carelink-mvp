"""Application configuration settings."""

import json
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = "postgresql://carelink:carelink@localhost:5432/carelink"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Settings
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Insurance Provider
    INSURANCE_PROVIDER: str = "mock"  # mock or availity

    # Mock API Settings
    MOCK_API_MIN_DELAY_MS: int = 800
    MOCK_API_MAX_DELAY_MS: int = 2000
    MOCK_ERROR_RATE: float = 0.05

    # App Settings
    DEBUG: bool = True
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000"]'

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from JSON string."""
        return json.loads(self.CORS_ORIGINS)

    # Cache TTL (1 hour in seconds)
    ELIGIBILITY_CACHE_TTL: int = 3600

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
