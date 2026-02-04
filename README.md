# CareLink - Insurance Eligibility Verification Platform

CareLink is a B2B healthcare infrastructure platform that streamlines the insurance verification process between healthcare providers and insurance companies.

## MVP Features

- **Real-time Eligibility Verification**: Check patient insurance eligibility in under 2 seconds
- **Mock Insurance API**: Realistic simulation of insurance company responses for development/demo
- **Coverage Details**: View copays, deductibles, out-of-pocket maximums, and more
- **History Tracking**: Full audit trail of all eligibility checks
- **Multi-user Support**: Role-based access (Admin, Staff, Viewer)

## Tech Stack

### Backend
- Python 3.11+
- FastAPI
- PostgreSQL
- Redis (caching)
- SQLAlchemy ORM

### Frontend
- React 18 + TypeScript
- Vite
- Ant Design
- React Router

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Seed the database with demo data
docker-compose exec backend python -m app.seed

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start PostgreSQL and Redis (via Docker or locally)
# Update .env with your database credentials

# Run database migrations and seed data
python -m app.seed

# Start the server
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Demo Credentials

After seeding the database, you can login with:

| Role   | Email                 | Password       |
|--------|----------------------|----------------|
| Admin  | admin@carelink.demo  | CareLink2024!  |
| Staff  | staff@carelink.demo  | CareLink2024!  |
| Viewer | viewer@carelink.demo | CareLink2024!  |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

### Eligibility
- `POST /api/eligibility/check` - Perform eligibility check
- `GET /api/eligibility/history` - Get check history (paginated)
- `GET /api/eligibility/{id}` - Get specific check details
- `GET /api/eligibility/insurers/list` - List supported insurers

### Users
- `GET /api/users` - List users in organization
- `POST /api/users` - Create new user (admin only)
- `PATCH /api/users/{id}` - Update user (admin only)

## Mock Insurance API

The MVP uses a mock insurance provider that simulates realistic API behavior:

- **Deterministic Responses**: Same member ID always returns the same data
- **Realistic Delays**: 800ms - 2000ms response times
- **Error Simulation**: ~5% error rate (member not found, service unavailable)
- **Varied Coverage**: Different plans, copays, and deductibles

### Supported Insurance Companies
- Blue Cross Blue Shield
- Aetna
- UnitedHealthcare
- Cigna
- Humana
- Kaiser Permanente
- Anthem
- Molina Healthcare
- Centene
- Medicare
- Medicaid

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://carelink:carelink@localhost:5432/carelink |
| REDIS_URL | Redis connection string | redis://localhost:6379/0 |
| SECRET_KEY | JWT signing key | (required in production) |
| INSURANCE_PROVIDER | mock or availity | mock |
| MOCK_API_MIN_DELAY_MS | Minimum mock delay | 800 |
| MOCK_API_MAX_DELAY_MS | Maximum mock delay | 2000 |

## Project Structure

```
carelink/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Security, dependencies
│   │   ├── insurance/    # Insurance provider layer
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── components/   # React components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript types
│   └── package.json
└── docker-compose.yml
```

## Future Enhancements

- Pre-authorization workflows
- Claims submission (837 EDI)
- Payment reconciliation (835 ERA)
- Real insurance API integration (Availity, Change Healthcare)
- EMR system integrations
