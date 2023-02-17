from pymongo import MongoClient
import configparser
from .account_manager import AccountManagerMongo

config = configparser.ConfigParser()
config.read('config.ini')

mongo_client = MongoClient(config['DATABASE']['DBConnectionString'])
account_db_manager = AccountManagerMongo(mongo_client)