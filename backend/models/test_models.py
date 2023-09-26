import unittest
from .bank import Transaction


class TestBankModels(unittest.TestCase):
    def test_transaction(self):
        transaction_dict = {
            "id": "ab0e9145-e195-42a0-80da-c9f00877d5b8",
            "origin": "origin",
            "text": "sample",
            "transaction_amount": {"currency": "EUR", "amount": -12.5},
            "booking_date": "2023-08-10 00:00:00",
            "type": "expense",
            "account": {
                "id": "95a038d7-e93a-481a-9f8c-4c17e806cc1b",
                "name": "Conto Corrente Principale",
            },
            "last_balance": {"currency": "EUR", "amount": 35},
        }

        transaction_obj = Transaction.model_validate(transaction_dict)
        assert transaction_obj.model_dump() == transaction_dict


if __name__ == "__main__":
    unittest.main()
