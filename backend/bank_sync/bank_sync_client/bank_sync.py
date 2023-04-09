from abc import ABC, abstractmethod
from datetime import datetime
from typing import List

from ..types import InstitutionInfo, BankLinkingDetailsBase, AccountData
from ..database_client.database_client import AccountDatabaseClient


class BankSyncClient(ABC):
    def __init__(self, account_db_client: AccountDatabaseClient):
        self.account_db_client = account_db_client

    @abstractmethod
    def initialize(self):
        pass

    @abstractmethod
    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
        pass
    
    @abstractmethod
    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkingDetailsBase:
        pass

    @abstractmethod
    def fetch_link_bank_status(self, bank_linking_details: BankLinkingDetailsBase) -> BankLinkingDetailsBase:
        pass

    def synchronize_user_accounts(self, username: str):
        user_bank_links = self.account_db_client.fetch_user_bank_links(username)
        for link in user_bank_links:
            for account in self.fetch_all_bank_accounts(link):
                if account is not None:
                    account = self.fetch_account_updates(account)
                    self.account_db_client.add_account(account)

    def update_bank_links_statuses(self, username: str):
        for bank_link_status in self.account_db_client.fetch_user_bank_links(username):
            bank_linking_details = self.fetch_link_bank_status(bank_link_status)
            self.account_db_client.update_bank_link_status(bank_linking_details)
        
        self.account_db_client.remove_unauthorized_bank_links(username)
        self.synchronize_user_accounts(username)

    @abstractmethod
    def fetch_all_bank_accounts(self,  bank_linking_details: BankLinkingDetailsBase) -> List[AccountData]:
        pass

    def track_new_account(self, account_data: AccountData):
        self.account_db_client.add_account(account_data)

    @abstractmethod
    def fetch_account_updates(self, account_data: AccountData) -> AccountData:
        pass
    
    def fetch_linked_accounts(self, username: str) -> List[AccountData]:
        return self.account_db_client.fetch_linked_accounts(username)
