from services.bank_connect.types import APICredentials
from services.bank_connect.implementation.nordigen import NordigenBankSyncClient
from services.database_crud import (
    AccountCRUD,
    BankLinkCRUD,
    TransactionCRUD,
    MongoAccountCRUD,
    MongoBankLinkCRUD,
    MongoTransactionCRUD,
)
from services.bank_connect.bank_connect import BankConnector
from services.bank_sync import BankSync
from pymongo import MongoClient

from settings import Settings

settings = Settings()

bank_connector: BankConnector = None
account_crud: AccountCRUD = None
bank_link_crud: BankLinkCRUD = None
transaction_crud: TransactionCRUD = None
bank_sync: BankSync = None
mongo_client: MongoClient = None


def initialize_bank_sync_client():
    global bank_sync, bank_connector, account_crud, bank_link_crud, transaction_crud, mongo_client

    mongo_client = MongoClient(settings.MONGO_DB_CONNECTION_STRING)["budget_app"]
    account_crud = MongoAccountCRUD(mongo_client)
    bank_link_crud = MongoBankLinkCRUD(mongo_client)
    transaction_crud = MongoTransactionCRUD(mongo_client)

    bank_connector = NordigenBankSyncClient(
        APICredentials(settings.NORDIGEN_SECRET_ID, settings.NORDIGEN_SECRET_KEY),
    )

    bank_sync = BankSync(bank_connector, account_crud, transaction_crud, bank_link_crud)


def get_mongo_client():
    global mongo_client
    return mongo_client


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
