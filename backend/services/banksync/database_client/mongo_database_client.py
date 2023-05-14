from pymongo import MongoClient
from typing import List
from datetime import datetime
import json

from .database_client_interface import AccountDatabaseClient, BANK_SYNC_CLIENT_TO_LINK_DETAIL_PARSER
from ..types import BankLinkingDetails, AccountData, AccountStatus, Transaction


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
        bank_linking_details_json = bank_linking_details.to_dict()
        bank_linking_details_json['user'] = username
        self.bank_link_collection.insert_one(bank_linking_details_json)

    def fetch_user_bank_links(self, username: str) -> List[BankLinkingDetails]:
        user_bank_link_details_list = self.bank_link_collection.find({
                                                                     'user': username})
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
        }, {"transactions": 0})

        return AccountData(
            id=account['_id'],
            name=account['name'],
            last_update=account['last_update'],
            balances=account['balances']) if account is not None else None

    def remove_unauthorized_bank_links(self, username: str):
        remove_query = {
            "user": username,
            "status": AccountStatus.AUTHORIZATION_REQUIRED
        }
        self.bank_link_collection.delete_many(remove_query)

    def _find_bank_linking_details_id(self, bank_linking_details: BankLinkingDetails):
        return self.bank_link_collection.find_one(bank_linking_details.get_identifiers())

    def add_account(self, account_data: AccountData):
        account = self.account_collection.find_one({"_id": account_data.id})
        if account is None:
            bank_link = self._find_bank_linking_details_id(
                account_data.bank_linking_details)
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


    def fetch_linked_accounts(self, username: str):
        #accounts = list(self.account_collection.find({'user': username}, {
        #                "transactions": {"$slice": [start_item_idx, n_items]}, 'bank_link_id': 0}))
        accounts = list(self.account_collection.find({'user': username}, {
                        "transactions": 0, 'bank_link_id': 0}))

        return accounts

    def fetch_transactions(
            self, account_id: str, date_from: datetime, date_to: datetime = None) -> List[Transaction]:
        print(account_id, date_from, date_to)
        account = list(self.account_collection.find({"_id": account_id}, {
            "transactions": {
                "$filter": {
                    "input": "$transactions",
                    "as": "transaction",
                    "cond": {
                        "$and": [
                            {"$gte": ["$$transaction.booking_date", date_from.strftime('%Y-%m-%d %H:%M:%S')]},
                            {"$lte": ["$$transaction.booking_date", date_to.strftime('%Y-%m-%d %H:%M:%S')]},
                        ]
                    }
                }
            }
        }))

        if account == []:
            return []

        return account[0]['transactions']

    def update_account(self, account_data: AccountData):
        account_data = json.loads(account_data.to_json())
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
                        "$concatArrays": [
                            account_data["transactions"],
                            "$transactions"
                        ]
                    }
                }
            }
        ]

        self.account_collection.update_one(
            {"_id": account_data["id"]}, update_query, upsert=True)

    def update_transaction(self, account_id: str, transaction: Transaction):
        find_query = {"_id": account_id,
                      "transactions.transaction_id": transaction.transaction_id}
        update_query = {
                "$set": {
                    "transactions.$.booking_date": transaction.booking_date,
                    "transactions.$.transaction_amount": transaction.transaction_amount.to_dict(),
                    "transactions.$.origin": transaction.origin,
                    "transactions.$.text": transaction.text,
                    "transactions.$.category": transaction.category,
                    "transactions.$.type": transaction.type
                }
            }
        
        self.account_collection.update_one(
            find_query, update_query, upsert=True)
