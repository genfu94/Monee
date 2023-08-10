import unittest
from .bank_sync import BankSync
from unittest.mock import Mock
from datetime import datetime
from dateutil.relativedelta import relativedelta

from ..models.bank import Transaction, Account

bank_connector_mock = Mock()
transaction_crud_mock = Mock()
account_crud_mock = Mock()

bank_connector_mock.bank_account_api.fetch_transactions.return_value = [
    Transaction(id="1", origin="orig", text="transaction1"),
    Transaction(id="2", origin="orig", text="transaction1"),
    Transaction(id="3", origin="orig", text="transaction1"),
]

transaction_crud_mock.find_by_account.return_value = [
    Transaction(id="1", origin="orig", text="transaction1"),
    Transaction(id="2", origin="orig", text="transaction1"),
    Transaction(id="3", origin="orig", text="transaction1"),
]

account_crud_mock.find_by_id.return_value = Account(
    id="acc1", name="Account 1", last_update=datetime.now() - relativedelta(years=1)
)


class TestBankSync(unittest.TestCase):
    def test_no_new_transactions(self):
        bank_sync = BankSync(bank_connector_mock, account_crud_mock, transaction_crud_mock, Mock())
        account, new_trans = bank_sync.fetch_account_updates("acc1", None)
        assert new_trans == []


if __name__ == "__main__":
    unittest.main()
