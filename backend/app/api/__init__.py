"""API routes."""

from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.eligibility import router as eligibility_router
from app.api.users import router as users_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(eligibility_router, prefix="/eligibility", tags=["Eligibility"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
