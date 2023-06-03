from services.banksync.types import APICredentials
from services.banksync.bank_client import NordigenBankSyncClient
from services.banksync.database_client import AccountDatabaseClient, MongoAccountDatabaseClient
from services.banksync.bank_client.bank_client_interface import BankSyncClientInterface
import configparser


bank_sync_client:BankSyncClientInterface = None
account_db_client: AccountDatabaseClient = None

def initialize_bank_sync_client():
    global bank_sync_client, account_db_client

    generic_config = configparser.ConfigParser()
    generic_config.read('generic_config.ini')

    account_db_client = MongoAccountDatabaseClient(generic_config['DATABASE']['DBConnectionString'])
    account_db_client.initialize()

    config = configparser.ConfigParser()
    config.read('config.ini')

    bank_sync_client = NordigenBankSyncClient(
        APICredentials(config['NORDIGEN']['NordigenSecretID'], config['NORDIGEN']['NordigenSecretKey']),
    )

    bank_sync_client.initialize()

def get_bank_sync_client():
    return bank_sync_client

def get_account_db_client():
    return account_db_client