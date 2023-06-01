from .categories import TransactionCategory
from .categorisation_rules import MOST_COMMON_WORDS_RULES, MOST_COMMON_COMPANY_RULES

def _rule_based_categorization(text, rules):
    for ruleset, category in rules.items():
        for word in ruleset:
            if word in text:
                return category
    
    return TransactionCategory.UNKNOWN

def rule_based_categorization(transaction_text, merchant_name):
    category = _rule_based_categorization(transaction_text.lower(), MOST_COMMON_WORDS_RULES)
    if category != TransactionCategory.UNKNOWN:
        return category
    
    return _rule_based_categorization(merchant_name.lower(), MOST_COMMON_COMPANY_RULES)
    