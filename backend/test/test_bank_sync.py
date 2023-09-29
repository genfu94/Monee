import unittest
from services.bank_sync import BankSync
from unittest.mock import Mock
from datetime import datetime
from dateutil.relativedelta import relativedelta

from schemas import Transaction, Account, CurrencyAmount

no_new_transactions_bank_connector_mock = Mock()
new_transactions_bank_connector_mock = Mock()
transaction_crud_mock = Mock()
account_crud_mock = Mock()

mock_amount = CurrencyAmount(currency="USD", amount=10.15)
no_new_transactions_bank_connector_mock.bank_account_api.fetch_transactions.return_value = [
    Transaction(
        id="1",
        origin="orig",
        text="transaction1",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
    Transaction(
        id="2",
        origin="orig",
        text="transaction2",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
    Transaction(
        id="3",
        origin="orig",
        text="transaction3",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
]

new_transactions_bank_connector_mock.bank_account_api.fetch_transactions.return_value = [
    Transaction(
        id="1",
        origin="orig",
        text="transaction1",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
    Transaction(
        id="2",
        origin="orig",
        text="transaction2",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
    Transaction(
        id="3",
        origin="orig",
        text="transaction3",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
    Transaction(
        id="4",
        origin="orig",
        text="transaction4",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
]

transaction_crud_mock.find_by_account.return_value = [
    Transaction(
        id="1",
        origin="orig",
        text="transaction1",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
    Transaction(
        id="2",
        origin="orig",
        text="transaction2",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
    Transaction(
        id="3",
        origin="orig",
        text="transaction3",
        booking_date="2023-09-28T00:00:00",
        type="unknown",
        amount=mock_amount,
    ),
]

account_crud_mock.find_by_id.return_value = Account(
    id="acc1", name="Account 1", last_update=datetime.now() - relativedelta(years=1)
)


class TestBankSync(unittest.TestCase):
    def test_no_new_transactions(self):
        bank_sync = BankSync(
            no_new_transactions_bank_connector_mock,
            account_crud_mock,
            transaction_crud_mock,
            Mock(),
        )
        account, new_trans = bank_sync.fetch_account_updates("acc1", None)
        self.assertListEqual(new_trans, [])

    def test_new_transactions(self):
        bank_sync = BankSync(
            new_transactions_bank_connector_mock,
            account_crud_mock,
            transaction_crud_mock,
            Mock(),
        )
        account, new_trans = bank_sync.fetch_account_updates("acc1", None)
        self.assertEqual(len(new_trans), 1)
        self.assertEqual(new_trans[0].text, "transaction4")


if __name__ == "__main__":
    unittest.main()
