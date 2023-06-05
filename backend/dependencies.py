from services.bank_connect.types import APICredentials
from services.bank_connect.implementation.nordigen import NordigenBankSyncClient
from services.database_crud import AccountCRUD, BankLinkCRUD, TransactionCRUD, MongoAccountCRUD, MongoBankLinkCRUD, MongoTransactionCRUD
from services.bank_connect.bank_connect import BankConnector
from services.bank_sync import BankSync
import configparser
from pymongo import MongoClient


bank_connector:BankConnector = None
account_crud: AccountCRUD = None
bank_link_crud: BankLinkCRUD = None
transaction_crud: TransactionCRUD = None
bank_sync: BankSync = None


def initialize_bank_sync_client():
    global bank_sync, bank_connector, account_crud, bank_link_crud, transaction_crud

    generic_config = configparser.ConfigParser()
    generic_config.read('generic_config.ini')

    mongo_client = MongoClient(generic_config['DATABASE']['DBConnectionString'])['budget_app']
    account_crud = MongoAccountCRUD(mongo_client)
    bank_link_crud = MongoBankLinkCRUD(mongo_client)
    transaction_crud = MongoTransactionCRUD(mongo_client)

    config = configparser.ConfigParser()
    config.read('config.ini')

    bank_connector = NordigenBankSyncClient(
        APICredentials(config['NORDIGEN']['NordigenSecretID'], config['NORDIGEN']['NordigenSecretKey']),
    )

    bank_sync = BankSync(bank_connector, account_crud, transaction_crud, bank_link_crud)

def get_bank_sync():
    return bank_sync

def get_bank_connector():
    return bank_connector


def get_account_crud():
    return account_crud


def get_bank_link_crud():
    return bank_link_crud


def get_transaction_crud():
    return transaction_crud