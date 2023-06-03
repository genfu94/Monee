from abc import ABC, abstractmethod
from typing import List
from datetime import datetime

from ..types import InstitutionInfo, BankLinkingDetailsBase, Account, Transaction


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

    @abstractmethod
    def fetch_account_ids_from_bank_link(self,  bank_linking_details: BankLinkingDetailsBase) -> List[str]:
        pass


class BankAccountClientInterface(ABC):
    @abstractmethod
    def fetch_transactions(self, account: Account, date_start: datetime, date_end: datetime) -> List[Transaction]:
        pass

    @abstractmethod
    def fetch_account(self, account_id: str) -> Account:
        pass


class BankSyncClientInterface(ABC):
    def __init__(self, bank_link_client: BankLinkClientInterface,
                 bank_account_client: BankAccountClientInterface):
        self.bank_link_client = bank_link_client
        self.bank_account_client = bank_account_client

    @abstractmethod
    def initialize(self):
        pass
