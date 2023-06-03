from abc import ABC, abstractmethod
from ..types import BankLink, NordigenBankLink, InstitutionInfo, AccountStatus, Account, Transaction
from typing import List, Dict
from datetime import datetime


def parse_nordigen_bank_link_details(bank_link_details_json: Dict) -> NordigenBankLink:
    return NordigenBankLink(
        client="Nordigen",
        link=bank_link_details_json['link'],
        requisition_id=bank_link_details_json['requisition_id'],
        institution=InstitutionInfo(**bank_link_details_json['institution']),
        status=bank_link_details_json['status']
    )


BANK_SYNC_CLIENT_TO_LINK_DETAIL_PARSER = {
    "Nordigen": parse_nordigen_bank_link_details
}

class BankLinkCRUD(ABC):
    @abstractmethod
    def add(self, username: str, bank_link: BankLink) -> bool:
        pass

    @abstractmethod
    def find_by_user(self, username: str) -> List[BankLink]:
        pass
    
    @abstractmethod
    def update(self, bank_link: BankLink) -> bool:
        pass
    
    @abstractmethod
    def delete_unauthorized_links(self, username) -> bool:
        pass
    

class AccountCRUD(ABC):
    @abstractmethod
    def add(self, username: str, account: Account) -> bool:
        pass

    @abstractmethod
    def find_by_id(self, account_id: str) -> Account:
        pass
    
    @abstractmethod
    def find_by_user(self, username: str) -> List[Account]:
        pass

    @abstractmethod
    def update(self, account: Account) -> bool:
        pass


class TransactionCRUD(ABC):
    @abstractmethod
    def add(self, account_id: str, transaction: Transaction) -> bool:
        pass

    @abstractmethod
    def update(self, transaction: Transaction) -> bool:
        pass

    @abstractmethod
    def find_by_account(self, account_id: str) -> List[Transaction]:
        pass

# class AccountDatabaseClient(ABC):
#     @abstractmethod
#     def initialize(self):
#         pass

#     @abstractmethod
#     def add_bank(self, username: str, bank_linking_details: BankLink):
#         pass

#     @abstractmethod
#     def fetch_user_bank_links(self, username: str) -> List[BankLink]:
#         pass

#     @abstractmethod
#     def update_bank_link_status(self, bank_linking_details: BankLink):
#         pass

#     @abstractmethod
#     def remove_unauthorized_bank_links(self, username: str):
#         pass

#     @abstractmethod
#     def add_account(self, account_data: Account):
#         pass

#     @abstractmethod
#     def find_account(self, account_id: str) -> Account:
#         pass

#     @abstractmethod
#     def fetch_linked_accounts(self, username: str):
#         pass

#     @abstractmethod
#     def update_account(self, account_data: Account):
#         pass

#     @abstractmethod
#     def update_transaction(self, username: str, transaction: Transaction):
#         pass

#     @abstractmethod
#     def fetch_transactions(
#             self, account_id: str, date_from: datetime, date_to: datetime = None) -> List[Transaction]:
#         pass
