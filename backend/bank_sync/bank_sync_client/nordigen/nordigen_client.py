from nordigen import NordigenClient
from .nordigen_bank_link_client import NordigenBankLinkClient
from .nordigen_bank_account_client import NordigenBankAccountClient
from ..bank_sync import BankSyncClient
from ...types import BankLinkingDetailsBase, AccountData, APICredentials, Transaction
from ...database_client.database_client import AccountDatabaseClient
from typing import List, Dict
from datetime import datetime


class NordigenBankSyncClient(BankSyncClient):
    def __init__(self, nordigen_auth_credentials: APICredentials, account_db_client: AccountDatabaseClient):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None
        super().__init__(account_db_client, None, None)


    def initialize(self):
        if self.nordigen_client != None:
            return

        self.account_db_client.initialize()
        
        try:
            self.nordigen_client = NordigenClient(
                secret_id = self.nordigen_auth_credentials.secret_id,
                secret_key=self.nordigen_auth_credentials.secret_key
            )

            self.nordigen_client.generate_token()
            self.bank_link_client = NordigenBankLinkClient(self.nordigen_client, self.account_db_client)
            self.bank_account_client = NordigenBankAccountClient(self.nordigen_client, self.account_db_client)
        except Exception as e:
            print(e)
            self.nordigen_client = None

    
