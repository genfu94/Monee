from abc import ABC, abstractmethod
from typing import List
from datetime import datetime

from models.bank import InstitutionInfo, BankLink, Account, Transaction, AccountStatus


class BankLinkAPI(ABC):
    @abstractmethod
    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
        pass

    @abstractmethod
    def link_bank(self, institution: InstitutionInfo) -> BankLink:
        pass

    @abstractmethod
    def fetch_link_bank_status(self, bank_link: BankLink) -> AccountStatus:
        pass

    @abstractmethod
    def fetch_account_ids_from_bank_link(self, bank_link: BankLink) -> List[str]:
        pass


class BankAccountAPI(ABC):
    @abstractmethod
    def fetch_transactions(self, account_id: str, date_start: datetime, date_end: datetime) -> List[Transaction]:
        pass

    @abstractmethod
    def fetch_account(self, account_id: str) -> Account:
        pass


class BankConnector(ABC):
    def __init__(self, bank_link_api: BankLinkAPI, bank_account_api: BankAccountAPI):
        self.bank_link_api = bank_link_api
        self.bank_account_api = bank_account_api
