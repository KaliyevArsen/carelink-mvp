"""Mock data for insurance eligibility simulation."""

# Supported insurance companies
INSURANCE_COMPANIES = [
    "Blue Cross Blue Shield",
    "Aetna",
    "UnitedHealthcare",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
    "Anthem",
    "Molina Healthcare",
    "Centene",
    "Medicare",
    "Medicaid",
]

# Plan types
PLAN_TYPES = ["PPO", "HMO", "EPO", "POS", "HDHP"]

# Plan names by type
PLAN_NAMES = {
    "PPO": [
        "PPO Gold 500",
        "PPO Silver 1000",
        "PPO Bronze 2500",
        "PPO Platinum 250",
        "PPO Standard",
        "PPO Plus",
    ],
    "HMO": [
        "HMO Select",
        "HMO Basic",
        "HMO Premium",
        "HMO Community",
        "HMO Value",
    ],
    "EPO": [
        "EPO Standard",
        "EPO Plus",
        "EPO Select",
    ],
    "POS": [
        "POS Flex",
        "POS Choice",
        "POS Premier",
    ],
    "HDHP": [
        "HDHP with HSA",
        "HDHP Bronze",
        "HDHP Silver",
    ],
}

# Copay ranges by visit type (in dollars)
COPAY_RANGES = {
    "primary_care": [20, 25, 30, 35, 40],
    "specialist": [40, 50, 60, 75, 80],
    "urgent_care": [50, 75, 100, 125],
    "emergency": [150, 200, 250, 300, 350],
}

# Deductible options
DEDUCTIBLES_INDIVIDUAL = [250, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000]
DEDUCTIBLES_FAMILY = [500, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 10000]

# Out of pocket maximums
OOP_MAX_INDIVIDUAL = [3000, 4000, 5000, 6000, 7000, 8000, 9000]
OOP_MAX_FAMILY = [6000, 8000, 10000, 12000, 14000, 16000, 18000]

# Coinsurance rates
COINSURANCE_RATES = ["70%", "80%", "90%", "100%"]

# Subscriber relationships
RELATIONSHIPS = ["Self", "Spouse", "Child", "Domestic Partner"]

# Error messages for simulated failures
ERROR_MESSAGES = {
    "not_found": [
        "Member not found in payer system",
        "No matching member record found",
        "Unable to locate member with provided information",
    ],
    "service_unavailable": [
        "Payer system temporarily unavailable",
        "Connection timeout to payer",
        "Service maintenance in progress",
    ],
    "invalid_data": [
        "Invalid member ID format",
        "Date of birth does not match records",
        "Group number not found",
    ],
}

# First names for generating subscriber names
FIRST_NAMES = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer",
    "Michael", "Linda", "William", "Elizabeth", "David", "Barbara",
    "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah",
    "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
]

# Last names for generating subscriber names
LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia",
    "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez",
    "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore",
    "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
]
