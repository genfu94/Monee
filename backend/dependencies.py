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
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from settings import Settings

settings = Settings()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bank_connector: BankConnector = None
account_crud: AccountCRUD = None
bank_link_crud: BankLinkCRUD = None
transaction_crud: TransactionCRUD = None
bank_sync: BankSync = None
mongo_client: MongoClient = None


def register_user(username: str, password: str):
    global mongo_client
    users_collection = mongo_client["users"]
    U = list(users_collection.find({"username": username}))
    if len(U) != 0:
        raise Exception("Username already exists")

    print("I'm here")
    users_collection.insert_one(
        {"username": username, "hashed_password": pwd_context.hash(password)}
    )


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(username: str):
    user_collection = mongo_client["users"]
    return user_collection.find_one({"username": username})


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False

    return user


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
