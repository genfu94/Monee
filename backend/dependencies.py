from services.bank_connect.types import APICredentials
from services.bank_connect.implementation.nordigen import NordigenBankSyncClient
from services.database_crud import AccountCRUD, BankLinkCRUD, TransactionCRUD, MongoAccountCRUD, MongoBankLinkCRUD, MongoTransactionCRUD
from services.bank_connect.bank_connect import BankConnector
from services.bank_sync import BankSync
from pymongo import MongoClient
import requests
from time import sleep
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.serialization import PublicFormat, Encoding

from config import fetch_config


bank_connector:BankConnector = None
account_crud: AccountCRUD = None
bank_link_crud: BankLinkCRUD = None
transaction_crud: TransactionCRUD = None
bank_sync: BankSync = None
authentication_public_key: str = None


def initialize_bank_sync_client():
    global bank_sync, bank_connector, account_crud, bank_link_crud, transaction_crud

    conf = fetch_config()

    mongo_client = MongoClient(conf['DBConnectionString'])['budget_app']
    account_crud = MongoAccountCRUD(mongo_client)
    bank_link_crud = MongoBankLinkCRUD(mongo_client)
    transaction_crud = MongoTransactionCRUD(mongo_client)

    bank_connector = NordigenBankSyncClient(
        APICredentials(conf['NordigenSecretID'], conf['NordigenSecretKey']),
    )

    bank_sync = BankSync(bank_connector, account_crud, transaction_crud, bank_link_crud)


def fetch_authentication_public_key():
    global authentication_public_key
    while True:
        try:
            cert_json = requests.get('http://keycloak:8080/realms/monee/protocol/openid-connect/certs').json()
            break
        except Exception as e:
            sleep(5)
    
    sig_key = list(filter(lambda x: x['use'] == 'sig', cert_json['keys']))[0]['x5c'][0]
    cert_data = "-----BEGIN CERTIFICATE-----\n" + str(sig_key) + "\n-----END CERTIFICATE-----"
    cert_data = bytes(cert_data, 'utf-8')
    cert = x509.load_pem_x509_certificate(cert_data, default_backend())
    authentication_public_key = cert.public_key().public_bytes(Encoding.PEM, PublicFormat.SubjectPublicKeyInfo)

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

def get_authentication_public_key():
    return authentication_public_key