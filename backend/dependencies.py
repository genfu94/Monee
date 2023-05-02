from services.bank_sync.data_types import APICredentials
from services.bank_sync.bank_sync_impl.nordigen.nordigen_client import NordigenBankSyncClient
from services.bank_sync.database_client import MongoAccountDatabaseClient
from services.bank_sync.bank_sync import BankSyncClient
import configparser


bank_sync_client:BankSyncClient = None

def initialize_bank_sync_client():
    global bank_sync_client

    generic_config = configparser.ConfigParser()
    generic_config.read('generic_config.ini')

    account_db_client = MongoAccountDatabaseClient(generic_config['DATABASE']['DBConnectionString'])

    config = configparser.ConfigParser()
    config.read('config.ini')

    bank_sync_client = NordigenBankSyncClient(
        APICredentials(config['NORDIGEN']['NordigenSecretID'], config['NORDIGEN']['NordigenSecretKey']),
        account_db_client
    )

    bank_sync_client.initialize()

def get_bank_sync_client():
    return bank_sync_client