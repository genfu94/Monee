import unittest
import mongomock
import uuid
from datetime import datetime
from database.crud import MongoTransactionCRUD, MongoAccountCRUD
from schemas import Transaction, CurrencyAmount, Account, BankLink, InstitutionInfo

mock_transactions = [
    Transaction(
        id=str(uuid.uuid4()),
        origin="origin",
        amount=CurrencyAmount(currency="EUR", amount=10.0),
        booking_date="2023-09-28T00:00:00",
        type="expense",
        category="unknown",
        account_balance=10.0,
    )
]

mock_account_id = str(uuid.uuid4())
mock_bank_link = BankLink(
    client="Nordigen",
    requisition_id="req",
    institution=InstitutionInfo(name="N26"),
    link="link",
)
mock_account_obj = Account(id=mock_account_id, name="Account")


class TestTransactionCrud(unittest.TestCase):
    def setUp(self):
        self.mongo_client = mongomock.MongoClient().db.collection
        self.transaction_crud = MongoTransactionCRUD(self.mongo_client)
        self.account_crud = MongoAccountCRUD(self.mongo_client)
        self.account_crud.add("user", mock_bank_link, mock_account_obj)

    def test_transaction_add(self):
        self.transaction_crud.add(mock_account_id, mock_transactions)

        transactions = list(self.mongo_client["transactions"].find({}))
        self.assertNotEqual(transactions, [])
        self.assertEqual(transactions[0]["origin"], "origin")

    def test_transaction_update(self):
        updated_transaction = mock_transactions[0].model_copy()
        updated_transaction.category = "groceries"

        self.transaction_crud.add(mock_account_id, mock_transactions)
        self.transaction_crud.update(mock_account_id, updated_transaction)
        transactions = list(self.mongo_client["transactions"].find({}))

        self.assertEqual(transactions[0]["category"], "groceries")

    def test_find_by_account(self):
        self.transaction_crud.add(mock_account_id, mock_transactions)

        account_transactions = self.transaction_crud.find_by_account(mock_account_id)
        self.assertEqual(len(account_transactions), 1)

        account_transactions = self.transaction_crud.find_by_account("non_existing")
        self.assertEqual(len(account_transactions), 0)


if __name__ == "__main__":
    unittest.main()
