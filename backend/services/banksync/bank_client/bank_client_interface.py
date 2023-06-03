from abc import ABC, abstractmethod
from typing import List

from ..types import InstitutionInfo, BankLinkingDetailsBase, AccountData


class BankLinkClientInterface(ABC):
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
    @abstractmethod
    def fetch_all_bank_accounts(self,  bank_linking_details: BankLinkingDetailsBase) -> List[AccountData]:
        pass

    @abstractmethod
    def fetch_account_updates(self, account_data: AccountData) -> AccountData:
        pass


class BankSyncClientInterface(ABC):
    def __init__(self, bank_link_client: BankLinkClientInterface,
                 bank_account_client: BankAccountClientInterface):
        self.bank_link_client = bank_link_client
        self.bank_account_client = bank_account_client

    @abstractmethod
    def initialize(self):
        pass
