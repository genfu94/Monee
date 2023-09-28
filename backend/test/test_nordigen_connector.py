import unittest
from unittest.mock import Mock, MagicMock
import uuid
from services.bank_connect.implementation.nordigen import NordigenBankAccountClient


account_api_mock = Mock()
account_api_mock.get_details.return_value = {
    "account": {"status": "active", "name": "Main Account"}
}
account_api_mock.get_balances.return_value = {
    "balances": [{"balanceAmount": {"amount": 111.23, "currency": "USD"}}]
}
account_api_mock.get_transactions.return_value = {
    "transactions": {
        "booked": [
            {
                "transactionAmount": {"amount": 12.5, "currency": "USD"},
                "transactionId": str(uuid.uuid4()),
                "bookingDate": "2023-09-28",
                "creditorName": "creditor",
            }
        ],
        "pending": [],
    }
}

nordigen_client_mock = Mock()
nordigen_client_mock.account_api.return_value = account_api_mock

account_id_mock = str(uuid.uuid4())


class TestNordigenConnector(unittest.TestCase):
    def setUp(self):
        self.nordigen_connector = NordigenBankAccountClient(nordigen_client_mock)

    def test_fetch_transactions(self):
        transactions = self.nordigen_connector.fetch_transactions(account_id_mock)

        self.assertEqual(len(transactions), 1)
        self.assertEqual(transactions[0].category, "unknown")
        self.assertEqual(transactions[0].account_balance, 111.23)
        self.assertEqual(transactions[0].amount.amount, 12.5)
        self.assertEqual(transactions[0].amount.currency, "USD")
