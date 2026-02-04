"""Seed script to create initial data for development and testing."""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models.organization import Organization, OrganizationType, SubscriptionTier
from app.models.user import User, UserRole
from app.core.security import get_password_hash


def seed_database():
    """Create initial seed data."""
    # Create tables
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # Check if data already exists
        existing_org = db.query(Organization).first()
        if existing_org:
            print("Database already seeded. Skipping...")
            return

        # Create demo organization
        demo_org = Organization(
            name="CareLink Demo Clinic",
            type=OrganizationType.CLINIC,
            npi_number="1234567890",
            address="123 Healthcare Ave, Medical City, MC 12345",
            phone="(555) 123-4567",
            subscription_tier=SubscriptionTier.PROFESSIONAL,
        )
        db.add(demo_org)
        db.flush()  # Get the org ID

        print(f"Created organization: {demo_org.name}")

        # Create demo users
        users_data = [
            {
                "email": "admin@carelink.demo",
                "password": "CareLink2024!",
                "full_name": "Admin User",
                "role": UserRole.ADMIN,
            },
            {
                "email": "staff@carelink.demo",
                "password": "CareLink2024!",
                "full_name": "Staff Member",
                "role": UserRole.STAFF,
            },
            {
                "email": "viewer@carelink.demo",
                "password": "CareLink2024!",
                "full_name": "Viewer User",
                "role": UserRole.VIEWER,
            },
        ]

        for user_data in users_data:
            user = User(
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                full_name=user_data["full_name"],
                role=user_data["role"],
                organization_id=demo_org.id,
                is_active=True,
            )
            db.add(user)
            print(f"Created user: {user_data['email']} ({user_data['role'].value})")

        db.commit()
        print("\nSeed data created successfully!")
        print("\nDemo credentials:")
        print("  Admin: admin@carelink.demo / CareLink2024!")
        print("  Staff: staff@carelink.demo / CareLink2024!")
        print("  Viewer: viewer@carelink.demo / CareLink2024!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
