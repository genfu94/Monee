from enum import Enum


class TransactionCategory(Enum):
    UNKNOWN = "unknown"
    BAR = "bar"
    GROCERIES = "groceries"
    RESTAURANT = "restaurant"
    HEALTH_CARE = "health_care"
    FUEL = "fuel"
    BILLS = "bills"
    SHOPPING = "shopping"
    VEHICLE_MAINTENANCE = "vehicle_maintenance"
    PARKING = "parking"
    HOME_MAINTENANCE = "home_maintenance"
    FEES = "fees"
    HOLIDAYS = "holidays"
    REFUNDS = "refunds"
    ENTERTAINMENT = "entertainment"
    GIFTS = "gifts"
    PUBLIC_TRANSPORT = "public_transport"
    EDUCATION = "education"
    RENT_MORTGAGE = "rent_mortgage"
    SUBSCRIPTIONS = "subscriptions"
    WAGES = "wages"
    INVESTMENT = "investment"
    INSURANCES = "insurances"


def convert_wallet_categories(category: str) -> TransactionCategory:
    if category in ["Unknown Expense", "Unknown Income", "UNKNOWN_CATEGORY", "Missing"]:
        return TransactionCategory.UNKNOWN

    if category in ["Bar, cafe", "Food & Drinks"]:
        return TransactionCategory.BAR

    if category in [
        "Electronics, accessories",
        "Software, apps, games",
        "Clothes & shoes",
        "Stationery, tools",
        "Shopping",
    ]:
        return TransactionCategory.SHOPPING

    if category in ["Groceries", "Pets, animals"]:
        return TransactionCategory.GROCERIES

    if category in ["Restaurant, fast-food"]:
        return TransactionCategory.RESTAURANT

    if category in ["Fuel"]:
        return TransactionCategory.FUEL

    if category in ["Energy, utilities", "Phone, cell phone"]:
        return TransactionCategory.BILLS

    if category in ["Health care, doctor", "Drug-store, chemist"]:
        return TransactionCategory.HEALTH_CARE

    if category in ["Parking"]:
        return TransactionCategory.PARKING

    if category in ["Vehicle insurance", "Maintenance, repairs"]:
        return TransactionCategory.VEHICLE_MAINTENANCE

    if category in ["Holiday, trips, hotels"]:
        return TransactionCategory.HOLIDAYS

    if category in ["Public transport"]:
        return TransactionCategory.PUBLIC_TRANSPORT

    if category in ["Insurances"]:
        return TransactionCategory.INSURANCES

    if category in ["Mortgage", "Rent"]:
        return TransactionCategory.RENT_MORTGAGE

    if category in ["Refunds (tax, purchase)"]:
        return TransactionCategory.REFUNDS

    if category in ["Charges, Fees", "Financial expenses"]:
        return TransactionCategory.FEES

    if category in ["Charity, gifts", "Gifts, joy", "Gifts"]:
        return TransactionCategory.GIFTS

    if category in ["Home, garden"]:
        return TransactionCategory.HOME_MAINTENANCE

    if category in ["Wage, invoices", "Income"]:
        return TransactionCategory.WAGES

    if category in [
        "Life & Entertainment",
        "Hobbies",
        "Culture, sport events",
        "Life events",
        "Active sport, fitness",
    ]:
        return TransactionCategory.ENTERTAINMENT

    if category in ["Education, development"]:
        return TransactionCategory.EDUCATION

    if category in ["Books, audio, subscriptions", "TV, Streaming"]:
        return TransactionCategory.SUBSCRIPTIONS

    if category in ["Investments", "Financial investments"]:
        return TransactionCategory.INVESTMENT

    return TransactionCategory.UNKNOWN
