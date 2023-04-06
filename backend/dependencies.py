from bank_sync.types import APICredentials
from bank_sync.bank_sync_client.nordigen_client import NordigenBankSyncClient
from bank_sync.database_client.database_client import MongoAccountDatabaseClient
from bank_sync.bank_sync_client.bank_sync import BankSyncClient
import configparser


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