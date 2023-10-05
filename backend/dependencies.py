from schemas import APICredentials
from services.bank_connect.implementation.nordigen import NordigenBankSyncClient
from database.crud import (
    MongoAccountCRUD,
    MongoBankLinkCRUD,
    MongoTransactionCRUD,
)
from services.bank_sync import BankSync
from pymongo import MongoClient
from services.authentication import MongoAuthenticationEngine

from settings import Settings

settings = Settings()
bank_sync: BankSync = None
mongo_client: MongoClient = None
authentication_engine: MongoAuthenticationEngine = None


def initialize_bank_sync_client():
    global bank_sync, mongo_client, authentication_engine

    mongo_client = MongoClient(settings.MONGO_DB_CONNECTION_STRING)["budget_app"]
    account_crud = MongoAccountCRUD(mongo_client)
    bank_link_crud = MongoBankLinkCRUD(mongo_client)
    transaction_crud = MongoTransactionCRUD(mongo_client)
    authentication_engine = MongoAuthenticationEngine(
        settings.AUTH_SECRET_KEY, mongo_client
    )

    bank_connector = NordigenBankSyncClient(
        APICredentials(
            secret_id=settings.NORDIGEN_SECRET_ID,
            secret_key=settings.NORDIGEN_SECRET_KEY,
        ),
    )

    bank_sync = BankSync(bank_connector, account_crud, transaction_crud, bank_link_crud)


def get_mongo_client():
    global mongo_client
    return mongo_client


def get_authentication_engine():
    global authentication_engine
    return authentication_engine


def get_bank_sync():
    return bank_sync
