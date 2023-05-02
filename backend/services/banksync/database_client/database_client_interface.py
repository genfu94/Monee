from abc import ABC, abstractmethod
from ..types import BankLinkingDetails, NordigenBankLinkingDetails, InstitutionInfo, AccountStatus, AccountData, Transaction
from typing import List, Dict
from datetime import datetime


def parse_nordigen_bank_link_details(bank_link_details_json: Dict) -> NordigenBankLinkingDetails:
    return NordigenBankLinkingDetails(
        client="Nordigen",
        link=bank_link_details_json['link'],
        requisition_id=bank_link_details_json['requisition_id'],
        institution=InstitutionInfo(**bank_link_details_json['institution']),
        status=bank_link_details_json['status']
    )


BANK_SYNC_CLIENT_TO_LINK_DETAIL_PARSER = {
    "Nordigen": parse_nordigen_bank_link_details
}


class AccountDatabaseClient(ABC):
    @abstractmethod
    def initialize(self):
        pass

    @abstractmethod
    def add_bank(self, username: str, bank_linking_details: BankLinkingDetails):
        pass

    @abstractmethod
    def fetch_user_bank_links(self, username: str) -> List[BankLinkingDetails]:
        pass

    @abstractmethod
    def update_bank_link_status(self, bank_linking_details: BankLinkingDetails):
        pass

    @abstractmethod
    def remove_unauthorized_bank_links(self, username: str):
        pass

    @abstractmethod
    def add_account(self, account_data: AccountData):
        pass

    @abstractmethod
    def find_account(self, account_id: str) -> AccountData:
        pass

    @abstractmethod
    def fetch_linked_accounts(self, username: str):
        pass

    @abstractmethod
    def update_account(self, account_data: AccountData):
        pass

    @abstractmethod
    def update_transaction(self, username: str, transaction: Transaction):
        pass

    @abstractmethod
    def fetch_transactions(
            self, account_data: AccountData, date_from: datetime, date_to: datetime = None) -> List[Transaction]:
        pass
