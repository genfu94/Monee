from pymongo import MongoClient
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

mongo_client = MongoClient(config['DATABASE']['DBConnectionString'])