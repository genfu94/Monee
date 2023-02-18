import configparser
from .account_manager import AccountManagerMongo

config = configparser.ConfigParser()
config.read('config.ini')

