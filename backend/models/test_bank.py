import unittest
from .bank import Transaction


class TestBankModels(unittest.TestCase):
    def test_transaction(self):
        transaction_dict = {
            "id": "asd",
            "origin": "Justas",
            "text": "",
            "transaction_amount": {"currency": "EUR", "amount": -12.5},
            "booking_date": "2023-08-10 00:00:00",
            "type": "expense",
        }

        transaction_obj = Transaction.model_validate(transaction_dict)
        assert transaction_obj.model_dump() == transaction_dict


if __name__ == "__main__":
    unittest.main()
