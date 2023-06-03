from .categories import TransactionCategory

MOST_COMMON_WORDS_RULES = {
    ('bar', 'cafe', 'gelato', 'ice cream', 'cornetto', 'cappuccino'): TransactionCategory.BAR,
    ('spesa', 'alimentari'): TransactionCategory.GROCERIES,
    ('cena', 'pranzo', 'ristorante', 'osteria'): TransactionCategory.RESTAURANT,
    ('medicina', 'dott.', 'dottore', 'medicine', 'ospedale', 'visita'): TransactionCategory.HEALTH_CARE,
    ('bolletta', 'luce', 'gas', 'bollette', 'energia'): TransactionCategory.BILLS,
    ('shop', 'shopping'): TransactionCategory.SHOPPING,
    ('riparazione', 'meccanico', 'officina'): TransactionCategory.VEHICLE_MAINTENANCE,
    ('oneri', 'imposte', 'onere', 'imposta'): TransactionCategory.FEES,
    ('viaggio', 'hotel'): TransactionCategory.HOLIDAYS,
    ('regalo', 'regali', 'regalato'): TransactionCategory.GIFTS,
    ('stipendio', 'emolumenti', 'pensione'): TransactionCategory.WAGES
}

MOST_COMMON_COMPANY_RULES = {
    ('conad', 'eurospin', 'emmepiu', 'carrefour'): TransactionCategory.GROCERIES,
    ('eni', 'enel', 'sorgenia', 'a2a', 'fastweb', 'tim'): TransactionCategory.BILLS,
    ('amazon', 'ebay', 'aliexpress', 'google'): TransactionCategory.SHOPPING,
    ('netflix', 'spotify', 'sky'): TransactionCategory.SUBSCRIPTIONS
}