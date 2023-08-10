import unittest
from ..types import APICredentials
from .nordigen import NordigenBankSyncClient


bank_sync = NordigenBankSyncClient(
    APICredentials(
        "8782f1a9-d716-4b0a-b60d-5dbb1d401528",
        "3c1de83e0ede5f5a4d28916e375a450c576ad803c4ae85e5121cf8892414a5cf27d67870306d370d6b92f13c3b2204e6029128fa3eef3aec24d7056c5d2f2855",
    )
)


class TestBankSync(unittest.TestCase):
    def test_transaction_fetch(self):
        transactions = bank_sync.bank_account_api.fetch_transactions("8b4b8896-bef7-4ce0-b69c-03bba8bf7fc4")


if __name__ == "__main__":
    unittest.main()
