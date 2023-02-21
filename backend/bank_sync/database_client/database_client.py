from abc import ABC, abstractmethod
from ..types import BankLinkingDetails, NordigenBankLinkingDetails, InstitutionInfo, AccountData
from pymongo import MongoClient
from typing import List, Dict


def parse_nordigen_bank_link_details(bank_link_details_json: Dict) -> NordigenBankLinkingDetails:
    return NordigenBankLinkingDetails(
        client="Nordigen",
        link=bank_link_details_json['link'],
        requisition_id=bank_link_details_json['requisition_id'],
        institution=InstitutionInfo(**bank_link_details_json['institution']),
        status=bank_link_details_json['status']
    )


BANK_SYNC_CLIENT_TO_LINK_DETAIL_PARSER = {
    "Nordigen": parse_nordigen_bank_link_details
}


class AccountDatabaseClient(ABC):
    @abstractmethod
    def initialize(self):
        pass

    @abstractmethod
    def add_bank(self, username: str, bank_linking_details: BankLinkingDetails):
        pass

    @abstractmethod
    def fetch_user_bank_links(self, username: str) -> List[BankLinkingDetails]:
        pass

    @abstractmethod
    def update_bank_link_status(self, bank_linking_details: BankLinkingDetails):
        pass

    @abstractmethod
    def add_account(self, account_data: AccountData):
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
        self.account_collection = self.db_client['accounts']

    def add_bank(self, username: str, bank_linking_details: BankLinkingDetails):
        bank_linking_details_json = bank_linking_details.dict()
        bank_linking_details_json['user'] = username
        self.bank_link_collection.insert_one(bank_linking_details_json)
    
    def fetch_user_bank_links(self, username: str) -> List[BankLinkingDetails]:
        user_bank_link_details_list = self.bank_link_collection.find({'user': username})
        return [BANK_SYNC_CLIENT_TO_LINK_DETAIL_PARSER[bank_link_detail['client']](bank_link_detail) for bank_link_detail in user_bank_link_details_list]

    def update_bank_link_status(self, bank_linking_details: BankLinkingDetails):
        filter_query = { 'requisition_id': bank_linking_details.requisition_id }
        update_query = {
            '$set': {
                'status': bank_linking_details.status
            }
        }
        self.bank_link_collection.update_one(filter_query, update_query)

    def _find_bank_linking_details_id(self, bank_linking_details: BankLinkingDetails):
        return self.bank_link_collection.find_one({
            "requisition_id": bank_linking_details.requisition_id
        })

    def add_account(self, account_data: AccountData):
        bank_link_id = self._find_bank_linking_details_id(account_data.bank_linking_details)

        self.account_collection.insert_one({
            '_id': account_data.account_id,
            'name': account_data.account_name,
            'balances': account_data.balances,
            'transactions': account_data.transactions,
            'bank_link_id': bank_link_id
        })


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