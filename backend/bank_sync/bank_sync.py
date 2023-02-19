from uuid import uuid4
from typing import List
from abc import ABC, abstractmethod
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
from dataclasses_json import dataclass_json
from pydantic import BaseModel

from nordigen import NordigenClient
from pymongo import MongoClient
import configparser


@dataclass_json
@dataclass
class AccountSyncInfo:
    pass


@dataclass_json
@dataclass
class NordigenAccountSyncInfo(AccountSyncInfo):
    requisition_id: str
    account_id: str


@dataclass
class APICredentials:
    secret_id: str
    secret_key: str



class BankLinkingDetails(BaseModel):
    pass


class InstitutionInfo(BaseModel):
    name: str
    id: str


class NordigenBankLinkingDetails(BankLinkingDetails):
    link: str
    requisition_id: str
    institution: InstitutionInfo


@dataclass
class Balance:
    currency: str
    amount: float


@dataclass
class Transaction:
    pass


@dataclass
class AccountStatus:
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


@dataclass_json
@dataclass
class AccountData:
    bank: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED
    account_name: str = None
    balances: List[Balance] = field(default_factory=list)
    transactions: List[Transaction] = field(default_factory=list)


class AccountDatabaseClient(ABC):
    @abstractmethod
    def initialize(self):
        pass

    @abstractmethod
    def add_bank(self, username: str, bank_linking_details: BankLinkingDetails):
        pass

    '''@abstractmethod
    def fetch_account(self, username: str, account_id: str):
        pass
    
    @abstractmethod
    def fetch_sync_info(self, username: str, account_id: str) -> AccountSyncInfo:
        pass
    
    @abstractmethod
    def update_account(self, username: str, account_data: AccountData):
        pass'''


class MongoAccountDatabaseClient(AccountDatabaseClient):
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self._mongo_client = None

    def initialize(self):
        if self._mongo_client:
            return
        
        self._mongo_client = MongoClient(self.connection_string)
        self.db_client = self._mongo_client['budget_app']
        self.bank_link_collection = self.db_client['bank_links']

    def add_bank(self, username: str, bank_linking_details: BankLinkingDetails):
        print("BANK LINKING DETAILS", bank_linking_details)
        bank_linking_details_json = bank_linking_details.dict()
        bank_linking_details_json['user'] = username
        self.bank_link_collection.insert_one(bank_linking_details_json)


class BankSyncClient(ABC):
    @abstractmethod
    def initialize(self):
        pass
    
    @abstractmethod
    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkingDetails:
        pass

    '''@abstractmethod
    def list_available_institutions_for_country(self, country_code: str):
        pass

    @abstractmethod
    def get_tracked_accounts(self, username: str):
        pass

    @abstractmethod
    def sync_account(self, username: str, account_id: str):
        pass
    
    @abstractmethod
    def remove_account(self, username: str, account_id: str):
        pass'''


class NordigenBankSyncClient(BankSyncClient):
    def __init__(self, nordigen_auth_credentials: APICredentials, account_db_client: AccountDatabaseClient):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None
        self.account_db_client = account_db_client

    def initialize(self):
        if self.nordigen_client != None:
            return

        print("ACCOUNT DB CLIENT", self.account_db_client)
        self.account_db_client.initialize()
        
        self.nordigen_client = NordigenClient(
            secret_id = self.nordigen_auth_credentials.secret_id,
            secret_key=self.nordigen_auth_credentials.secret_key
        )

        self.nordigen_client.generate_token()
    
    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkingDetails:
        init = self.nordigen_client.initialize_session(
            institution_id=institution.id,
            redirect_uri="https://nordigen.com",
            reference_id=str(uuid4())
        )

        bank_linking_details = NordigenBankLinkingDetails(
            link=init.link,
            requisition_id=init.requisition_id,
            institution=institution
        )

        self.account_db_client.add_bank(username, bank_linking_details)
        
        return bank_linking_details


'''class BankSync:
    def list_accounts(self, requisition_id):
        accounts = self.bank_sync_client.requisition.get_requisition_by_id(
            requisition_id=requisition_id
        )

        return accounts

    def get_sub_account_details(self, sub_account_id):
        sub_acc_instance = self.bank_sync_client.account_api(id=sub_account_id)
        return sub_acc_instance.get_details()['account']

    def get_sub_account_balance(self, sub_account_id):
        sub_acc_instance = self.bank_sync_client.account_api(id=sub_account_id)
        return sub_acc_instance.get_balances()['balances'][0]['balanceAmount']

    def get_sub_account_transactions(self, sub_account_id, last_account_update):
        sub_acc_instance = self.bank_sync_client.account_api(id=sub_account_id)
        return sub_acc_instance.get_transactions(date_from=last_account_update)['transactions']'''

bank_sync_client:BankSyncClient = None

def initialize_bank_sync_client():
    global bank_sync_client

    config = configparser.ConfigParser()
    config.read('config.ini')

    account_db_client = MongoAccountDatabaseClient(config['DATABASE']['DBConnectionString'])
    print("ACCOUNT DB CLIENT BEFORE PASSING", account_db_client)
    bank_sync_client = NordigenBankSyncClient(
        APICredentials(config['DEFAULT']['NordigenSecretID'], config['DEFAULT']['NordigenSecretKey']),
        account_db_client
    )


    bank_sync_client.initialize()

def get_bank_sync_client():
    return bank_sync_client