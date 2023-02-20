from uuid import uuid4
from abc import ABC, abstractmethod
from datetime import datetime

from nordigen import NordigenClient
import configparser
from .types import InstitutionInfo, BankLinkingDetails, APICredentials, NordigenBankLinkingDetails, AccountStatus
from .database_client.database_client import AccountDatabaseClient, MongoAccountDatabaseClient


class BankSyncClient(ABC):
    def __init__(self, account_db_client: AccountDatabaseClient):
        self.account_db_client = account_db_client

    @abstractmethod
    def initialize(self):
        pass
    
    @abstractmethod
    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkingDetails:
        pass

    @abstractmethod
    def fetch_link_bank_status(self, bank_linking_details: BankLinkingDetails) -> BankLinkingDetails:
        pass
    
    def update_bank_links_statuses(self, username: str):
        for bank_link_status in self.account_db_client.fetch_user_bank_links(username):
            bank_linking_details = self.fetch_link_bank_status(bank_link_status)
            self.account_db_client.update_bank_link_status(bank_linking_details)


class NordigenBankSyncClient(BankSyncClient):
    def __init__(self, nordigen_auth_credentials: APICredentials, account_db_client: AccountDatabaseClient):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None
        super().__init__(account_db_client)

        self.nordigen_link_status_map = {
            "CR": 0,
            "GC": 0,
            "UA": 0,
            "RJ": 0,
            "SA": 0,
            "GA": 0,
            "LN": 1,
            "SU": 2,
            "EX": 2
        }

    def initialize(self):
        if self.nordigen_client != None:
            return

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
            client="Nordigen",
            link=init.link,
            requisition_id=init.requisition_id,
            institution=institution
        )

        self.account_db_client.add_bank(username, bank_linking_details)
        
        return bank_linking_details

    def fetch_link_bank_status(self, bank_linking_details: BankLinkingDetails) -> BankLinkingDetails:
        nordigen_bank_link_details_json = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return NordigenBankLinkingDetails(
            client="Nordigen",
            link=nordigen_bank_link_details_json['link'],
            requisition_id=bank_linking_details.requisition_id,
            institution=bank_linking_details.institution,
            status=self.nordigen_link_status_map[nordigen_bank_link_details_json['status']]
        )


bank_sync_client:BankSyncClient = None

def initialize_bank_sync_client():
    global bank_sync_client

    config = configparser.ConfigParser()
    config.read('config.ini')

    account_db_client = MongoAccountDatabaseClient(config['DATABASE']['DBConnectionString'])

    bank_sync_client = NordigenBankSyncClient(
        APICredentials(config['DEFAULT']['NordigenSecretID'], config['DEFAULT']['NordigenSecretKey']),
        account_db_client
    )

    bank_sync_client.initialize()

def get_bank_sync_client():
    return bank_sync_client