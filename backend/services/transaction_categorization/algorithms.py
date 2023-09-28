from .categories import TransactionCategory
from .categorisation_rules import MOST_COMMON_WORDS_RULES, MOST_COMMON_COMPANY_RULES

# from sentence_transformers import SentenceTransformer, util
from schemas import Transaction
from typing import List

# model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


def _rule_based_categorization(text, rules):
    for ruleset, category in rules.items():
        for word in ruleset:
            if word in text:
                return category

    return TransactionCategory.UNKNOWN


def rule_based_categorization(transaction_text, merchant_name):
    transaction_text = "" if transaction_text == None else transaction_text
    category = _rule_based_categorization(
        transaction_text.lower(), MOST_COMMON_WORDS_RULES
    )
    if category != TransactionCategory.UNKNOWN:
        return category

    return _rule_based_categorization(merchant_name.lower(), MOST_COMMON_COMPANY_RULES)


# def _sentence_similarity(s1, s2):
#     embedding_1= model.encode(s1, convert_to_tensor=True)
#     embedding_2 = model.encode(s2, convert_to_tensor=True)

#     return util.pytorch_cos_sim(embedding_1, embedding_2)


def history_based_categorization(
    transaction: Transaction, transaction_history: List[Transaction]
) -> TransactionCategory:
    for t_hist in transaction_history:
        if not t_hist.category_edited:
            continue

        if t_hist.origin == transaction.origin:
            return TransactionCategory(t_hist.category)

    return TransactionCategory.UNKNOWN


def categorize(
    transaction: Transaction, transaction_history: List[Transaction]
) -> TransactionCategory:
    category = rule_based_categorization(transaction.text, transaction.origin)

    if category == TransactionCategory.UNKNOWN:
        category = history_based_categorization(transaction, transaction_history)

    return category
