from bank_sync.bank_sync import BankSyncClient, NordigenBankSyncClient, APICredentials
from bank_sync.database_client.database_client import MongoAccountDatabaseClient
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