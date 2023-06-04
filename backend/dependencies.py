from services.banksync.types import APICredentials
from services.banksync.bank_client import NordigenBankSyncClient
from services.banksync.database import AccountCRUD, BankLinkCRUD, TransactionCRUD, MongoAccountCRUD, MongoBankLinkCRUD, MongoTransactionCRUD
from services.banksync.bank_client.bank_client_interface import BankSyncClientInterface
import configparser
from pymongo import MongoClient


bank_sync_client:BankSyncClientInterface = None
account_crud: AccountCRUD = None
bank_link_crud: BankLinkCRUD = None
transaction_crud: TransactionCRUD = None


def initialize_bank_sync_client():
    global bank_sync_client, account_crud, bank_link_crud, transaction_crud

    generic_config = configparser.ConfigParser()
    generic_config.read('generic_config.ini')

    mongo_client = MongoClient(generic_config['DATABASE']['DBConnectionString'])['budget_app']
    account_crud = MongoAccountCRUD(mongo_client)
    bank_link_crud = MongoBankLinkCRUD(mongo_client)
    transaction_crud = MongoTransactionCRUD(mongo_client)

    config = configparser.ConfigParser()
    config.read('config.ini')

    bank_sync_client = NordigenBankSyncClient(
        APICredentials(config['NORDIGEN']['NordigenSecretID'], config['NORDIGEN']['NordigenSecretKey']),
    )

    bank_sync_client.initialize()


def get_bank_sync_client():
    return bank_sync_client


def get_account_crud():
    return account_crud


def get_bank_link_crud():
    return bank_link_crud


def get_transaction_crud():
    return transaction_crud