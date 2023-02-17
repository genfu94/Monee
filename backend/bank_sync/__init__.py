import configparser
from nordigen import NordigenClient
from .bank_sync import BankSync

config = configparser.ConfigParser()
config.read('config.ini')

nordic_client = NordigenClient(
    secret_id=config['DEFAULT']['NordigenSecretID'],
    secret_key=config['DEFAULT']['NordigenSecretKey']
)

nordic_client.generate_token()
bank_sync_client = BankSync(nordic_client)