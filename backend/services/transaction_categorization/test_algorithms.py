import unittest
from ..bank_connect.types import Transaction
from .categories import TransactionCategory
import pandas as pd
import os
from .categories import convert_wallet_categories
import random
from .algorithms import history_based_categorization

test_data_path = os.path.join(os.path.realpath(os.path.dirname(__file__)), 'test_data.csv')
test_data = pd.read_csv(test_data_path, sep=";")
test_data = test_data.T.to_dict().values()
test_data = [Transaction(id=i, category=convert_wallet_categories(t['category']).value, text=t['note'], origin=t['payee']) for i, t in enumerate(test_data)]
random.shuffle(test_data)
transaction_history = test_data[:int(len(test_data)*70/100)]
for t in transaction_history:
    t.category_edited = True
transactions = test_data[int(len(test_data)*70/100):]

class TestTransactionCategorization(unittest.TestCase):
    def test(self):
        scores = []
        for i, t in enumerate(transactions):
            new_cat = history_based_categorization(t, transaction_history).value
            scores.append(1 if new_cat == transactions[i].category else 0)
            transactions[i].category = new_cat

        assert (sum(scores)/len(scores) > 0.3)
        