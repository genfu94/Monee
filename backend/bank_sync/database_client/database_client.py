from abc import ABC, abstractmethod
from ..types import BankLinkingDetails, NordigenBankLinkingDetails, InstitutionInfo, AccountData, AccountStatus, Transaction
from pymongo import MongoClient
from typing import List, Dict
from datetime import datetime
import json
from collections import defaultdict
import calendar


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
    def remove_unauthorized_bank_links(self, username: str):
        pass

    @abstractmethod
    def add_account(self, account_data: AccountData):
        pass

    @abstractmethod
    def find_account(self, account_id: str) -> AccountData:
        pass

    @abstractmethod
    def fetch_linked_accounts(self, username: str):
        pass

    @abstractmethod
    def update_account(self, account_data: AccountData):
        pass
    
    @abstractmethod
    def update_transaction(self, username: str, transaction: Transaction):
        pass


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
        filter_query = bank_linking_details.get_identifiers()
        update_query = {
            '$set': {
                'status': bank_linking_details.status
            }
        }
        self.bank_link_collection.update_one(filter_query, update_query)
    
    def find_account(self, account_id: str):
        account = self.account_collection.find_one({
            "_id": account_id
        })

        return AccountData.parse_obj(account) if account is not None else None
    
    def remove_unauthorized_bank_links(self, username: str):
        remove_query = {
            "user":username,
            "status": AccountStatus.AUTHORIZATION_REQUIRED
        }
        self.bank_link_collection.delete_many(remove_query)

    def _find_bank_linking_details_id(self, bank_linking_details: BankLinkingDetails):
        return self.bank_link_collection.find_one(bank_linking_details.get_identifiers())

    def add_account(self, account_data: AccountData):
        account = self.account_collection.find_one({"_id": account_data.id})
        if account is None:
            bank_link = self._find_bank_linking_details_id(account_data.bank_linking_details)
            self.account_collection.insert_one({
                '_id': account_data.id,
                'name': account_data.name,
                'balances': account_data.balances,
                'transactions': account_data.transactions,
                'user': bank_link['user'],
                'last_update': account_data.last_update,
                'institution_name': bank_link['institution']['name'],
                'bank_link_id': bank_link['_id']
            })
        else:
            self.update_account(account_data)

    def _group_transactions_by_date(self, transaction_list):
        grouped_transactions = defaultdict(list)
        for transaction_id, transaction in transaction_list.items():
            transaction_date = datetime.strptime(transaction['booking_date'], "%Y-%m-%d %H:%M:%S")
            grouped_transactions[transaction_date].append(transaction)
        
        sorted_transaction_dates = sorted(list(grouped_transactions.keys()), reverse=True)
        return {i.strftime("%B %d, %Y"): grouped_transactions[i] for i in sorted_transaction_dates}


    def fetch_linked_accounts(self, username: str):
        accounts = list(self.account_collection.find({'user': username}, {'bank_link_id': 0}))
        for account in accounts:
            account['transactions'] = self._group_transactions_by_date(account['transactions'])
        
        return accounts
 
    def update_account(self, account_data: AccountData):
        account_data=json.loads(account_data.json())
        update_query = [
            {
                "$set": {
                    "balances": account_data["balances"],
                    "last_update": account_data["last_update"]
                }
            },
            {
                "$set": {
                    "transactions": {
                        "$mergeObjects": [
                            "$transactions",
                            account_data["transactions"]
                        ]
                    }
                }
            }
        ]

        self.account_collection.update_one({"_id": account_data["id"]}, update_query, upsert=True)
    
    def update_transaction(self, account_id: str, transaction: Transaction):
        update_query = [
            {
                "$set": {
                    "transactions": {
                        transaction.transaction_id: {
                                "booking_date": transaction.booking_date,
                                "transaction_amount": dict(transaction.transaction_amount),
                                "origin": transaction.origin,
                                "text": transaction.text,
                                "category": transaction.category,
                                "type": transaction.type
                        }
                    }
                }
            }
        ]
        self.account_collection.update_one({"_id": account_id}, update_query, upsert=True)