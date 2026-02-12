"""Mock data for insurance eligibility simulation."""

# Supported insurance companies (Kazakhstan)
INSURANCE_COMPANIES = [
    "Халық-Қазақстан",
    "Евразия",
    "Номад Иншуранс",
    "Виктория",
    "Казахинстрах",
    "Amanat",
    "Freedom Finance Insurance",
    "Kompetenz",
    "Interteach",
    "ФСМС (ОСМС)",  # Mandatory Social Health Insurance Fund
    "Jusan Garant",
]

# Plan types (Kazakhstan insurance types)
PLAN_TYPES = ["Стандарт", "Комфорт", "Премиум", "VIP", "Базовый"]

# Plan names by type
PLAN_NAMES = {
    "Стандарт": [
        "Стандарт 50",
        "Стандарт 100",
        "Стандарт Плюс",
        "Стандарт Эконом",
    ],
    "Комфорт": [
        "Комфорт Оптима",
        "Комфорт Семейный",
        "Комфорт Плюс",
        "Комфорт Бизнес",
    ],
    "Премиум": [
        "Премиум Голд",
        "Премиум Платинум",
        "Премиум Корпоратив",
    ],
    "VIP": [
        "VIP Exclusive",
        "VIP International",
        "VIP Elite",
    ],
    "Базовый": [
        "Базовый ОСМС",
        "Базовый Стандарт",
        "Базовый Плюс",
    ],
}

# Copay ranges by visit type (in tenge - KZT)
COPAY_RANGES = {
    "primary_care": [2000, 3000, 4000, 5000, 7000],
    "specialist": [5000, 7500, 10000, 12000, 15000],
    "urgent_care": [8000, 10000, 15000, 20000],
    "emergency": [15000, 25000, 35000, 50000],
}

# Deductible options (in tenge)
DEDUCTIBLES_INDIVIDUAL = [25000, 50000, 75000, 100000, 150000, 200000, 300000]
DEDUCTIBLES_FAMILY = [50000, 100000, 150000, 200000, 300000, 500000, 750000]

# Out of pocket maximums (in tenge)
OOP_MAX_INDIVIDUAL = [300000, 500000, 750000, 1000000, 1500000, 2000000]
OOP_MAX_FAMILY = [600000, 1000000, 1500000, 2000000, 3000000, 4000000]

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

# First names for generating subscriber names (Kazakh/Russian names)
FIRST_NAMES = [
    "Айбек", "Арман", "Асхат", "Бауыржан", "Данияр", "Ерлан",
    "Жанболат", "Нұрлан", "Серік", "Тимур", "Алмас", "Берік",
    "Айгүл", "Аружан", "Гүлнар", "Дана", "Жанар", "Карина",
    "Мадина", "Назгүл", "Сауле", "Томирис", "Әсел", "Балжан",
    "Александр", "Дмитрий", "Сергей", "Анна", "Елена", "Ольга",
]

# Last names for generating subscriber names (Kazakh/Russian surnames)
LAST_NAMES = [
    "Назарбаев", "Токаев", "Сатпаев", "Байтұрсынов", "Құнанбаев",
    "Ахметов", "Қасымов", "Жақсылықов", "Омаров", "Сейтқазин",
    "Мұратов", "Бекенов", "Нұрланов", "Жұмабаев", "Қойшыбаев",
    "Иванов", "Петров", "Сидоров", "Ким", "Пак", "Цой",
    "Исаев", "Рахимов", "Садыков", "Тлеуов", "Әбдіраймов",
    "Қалиев", "Әлиев", "Мәлікова", "Сәрсенова", "Батырханова",
]
