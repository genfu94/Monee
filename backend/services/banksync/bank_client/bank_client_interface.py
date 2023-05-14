from abc import ABC, abstractmethod
from typing import List

from ..types import InstitutionInfo, BankLinkingDetailsBase, AccountData
from ..database_client.database_client_interface import AccountDatabaseClient


class BankLinkClientInterface(ABC):
    def __init__(self, account_db_client: AccountDatabaseClient):
        self.account_db_client = account_db_client

    @abstractmethod
    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
        pass

    @abstractmethod
    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkingDetailsBase:
        pass

    @abstractmethod
    def fetch_link_bank_status(self, bank_linking_details: BankLinkingDetailsBase) -> BankLinkingDetailsBase:
        pass


class BankAccountClientInterface(ABC):
    def __init__(self, account_db_client: AccountDatabaseClient):
        self.account_db_client = account_db_client

    @abstractmethod
    def fetch_all_bank_accounts(self,  bank_linking_details: BankLinkingDetailsBase) -> List[AccountData]:
        pass

    @abstractmethod
    def fetch_account_updates(self, account_data: AccountData) -> AccountData:
        pass

    def fetch_linked_accounts(self, username: str):
        return self.account_db_client.fetch_linked_accounts(username)


class BankSyncClientInterface(ABC):
    def __init__(self, account_db_client: AccountDatabaseClient,
                 bank_link_client: BankLinkClientInterface,
                 bank_account_client: BankAccountClientInterface):
        self.account_db_client = account_db_client
        self.bank_link_client = bank_link_client
        self.bank_account_client = bank_account_client

    @abstractmethod
    def initialize(self):
        pass

    def synchronize_user_accounts(self, username: str):
        user_bank_links = self.account_db_client.fetch_user_bank_links(
            username)
        for link in user_bank_links:
            for account in self.bank_account_client.fetch_all_bank_accounts(link):
                account = self.bank_account_client.fetch_account_updates(
                    account)
                self.account_db_client.add_account(account)

    def update_bank_links_statuses(self, username: str):
        for bank_link_status in self.account_db_client.fetch_user_bank_links(username):
            bank_linking_details = self.bank_link_client.fetch_link_bank_status(
                bank_link_status)
            self.account_db_client.update_bank_link_status(
                bank_linking_details)

        self.account_db_client.remove_unauthorized_bank_links(username)
