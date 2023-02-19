from abc import ABC, abstractmethod
from ..types import BankLinkingDetails
from pymongo import MongoClient


class AccountDatabaseClient(ABC):
    @abstractmethod
    def initialize(self):
        pass

    @abstractmethod
    def add_bank(self, username: str, bank_linking_details: BankLinkingDetails):
        pass

    '''@abstractmethod
    def fetch_account(self, username: str, account_id: str):
        pass
    
    @abstractmethod
    def fetch_sync_info(self, username: str, account_id: str) -> AccountSyncInfo:
        pass
    
    @abstractmethod
    def update_account(self, username: str, account_data: AccountData):
        pass'''


class MongoAccountDatabaseClient(AccountDatabaseClient):
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self._mongo_client = None

    def initialize(self):
        if self._mongo_client:
            return
        
        self._mongo_client = MongoClient(self.connection_string)
        self.db_client = self._mongo_client['budget_app']
        self.bank_link_collection = self.db_client['bank_links']

    def add_bank(self, username: str, bank_linking_details: BankLinkingDetails):
        bank_linking_details_json = bank_linking_details.dict()
        bank_linking_details_json['user'] = username
        self.bank_link_collection.insert_one(bank_linking_details_json)
    
    '''def update_sub_account(self, sub_account_id: str, new_balance: dict, transactions: list):
        update_query = [
            {
                "$set": {"balance": new_balance},
            },
            {
                "$set": {"last_update": datetime.now().strftime("%Y-%m-%d")}
            },
            {
                "$set": {
                    "transactions": {
                        "$mergeObjects": [
                            "$transactions",
                            transactions
                        ]
                    }
                }
            }
        ]

        self.sub_account_collection.update_one({"_id": sub_account_id}, update_query, upsert=True)'''