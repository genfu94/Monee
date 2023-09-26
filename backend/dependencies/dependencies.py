from services.bank_connect.implementation.nordigen import NordigenBankSyncClient, APICredentials
from database.database_crud import (
    MongoBankCRUD,
    MongoTransactionCRUD,
)
from services.bank_sync import BankSync
from pymongo import MongoClient

from settings import Settings

settings = Settings()
bank_sync: BankSync = None
mongo_client: MongoClient = None


def initialize_bank_sync_client():
    global bank_sync, mongo_client

    mongo_client = MongoClient(settings.MONGO_DB_CONNECTION_STRING)["budget_app"]
    bank_crud = MongoBankCRUD(mongo_client)
    transaction_crud = MongoTransactionCRUD(mongo_client)

    bank_connector = NordigenBankSyncClient(
        APICredentials(settings.NORDIGEN_SECRET_ID, settings.NORDIGEN_SECRET_KEY),
    )

    bank_sync = BankSync(bank_connector, bank_crud, transaction_crud)


def get_mongo_client():
    global mongo_client
    return mongo_client


def get_bank_sync():
    return bank_sync
