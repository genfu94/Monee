from abc import ABC, abstractmethod

from services.banksync.types import Account, BankLink, Transaction
from ..types import BankLink, NordigenBankLink, InstitutionInfo, AccountStatus, Account, Transaction
from typing import List, Dict
import json
from dataclasses import asdict 
from dacite import from_dict


def parse_nordigen_bank_link_details(bank_link_details_json: Dict) -> NordigenBankLink:
    return NordigenBankLink(
        client="Nordigen",
        link=bank_link_details_json['link'],
        requisition_id=bank_link_details_json['requisition_id'],
        institution=InstitutionInfo(**bank_link_details_json['institution']),
        status=bank_link_details_json['status']
    )


BANK_SYNC_CLIENT_TO_BANK_LINK_PARSER = {
    "Nordigen": parse_nordigen_bank_link_details
}

class BankLinkCRUD(ABC):
    @abstractmethod
    def add(self, username: str, bank_link: BankLink) -> None:
        pass

    @abstractmethod
    def find_by_id(self, bank_link_id: str) -> BankLink:
        pass

    @abstractmethod
    def find_by_user(self, username: str) -> List[BankLink]:
        pass
    
    @abstractmethod
    def update(self, bank_link: BankLink) -> None:
        pass
    
    @abstractmethod
    def delete_unauthorized_links(self, username) -> None:
        pass
    

class AccountCRUD(ABC):
    @abstractmethod
    def add(self, username: str, bank_link: BankLink, account: Account) -> None:
        pass

    @abstractmethod
    def find_by_id(self, account_id: str) -> Account:
        pass
    
    @abstractmethod
    def find_by_user(self, username: str) -> List[Account]:
        pass

    @abstractmethod
    def update(self, account: Account) -> None:
        pass


class TransactionCRUD(ABC):
    @abstractmethod
    def add(self, account_id: str, transactions: List[Transaction]) -> None:
        pass

    @abstractmethod
    def update(self, transaction: Transaction) -> None:
        pass

    @abstractmethod
    def find_by_account(self, account_id: str) -> List[Transaction]:
        pass


class MongoBankLinkCRUD(BankLinkCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.bank_link_collection = self.mongo_client['bank_links']
    
    def add(self, username: str, bank_link: BankLink) -> None:
        bank_link_json = bank_link.to_dict()
        bank_link_json['user'] = username
        self.bank_link_collection.insert_one(bank_link_json)
    
    def find_by_id(self, bank_link_id: str) -> BankLink:
        return self.bank_link_collection.find_one({'id': bank_link_id}, {"_id": 0})
        
    def find_by_user(self, username: str) -> List[BankLink]:
        bank_link_list = self.bank_link_collection.find({'user': username})
        return [BANK_SYNC_CLIENT_TO_BANK_LINK_PARSER[bank_link['client']](bank_link) for bank_link in bank_link_list]

    def update(self, bank_link: BankLink) -> None:
        filter_query = bank_link.get_identifiers()
        update_query = {
            '$set': {
                'status': bank_link.status
            }
        }
        self.bank_link_collection.update_one(filter_query, update_query)
    
    def delete_unauthorized_links(self, username) -> None:
        remove_query = {
            "user": username,
            "status": AccountStatus.AUTHORIZATION_REQUIRED
        }
        self.bank_link_collection.delete_many(remove_query)


class MongoAccountCRUD(AccountCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.account_collection = self.mongo_client['accounts']

    def add(self, username: str, bank_link: BankLink, account: Account) -> None:
        account_json = asdict(account)
        account_json['user'] = username
        account_json['institution_name'] = bank_link.institution.name
        account_json['bank_link'] = asdict(bank_link)
        account_json['transactions'] = []
        self.account_collection.insert_one(account_json)
    
    def find_by_id(self, account_id: str) -> Account:
        account = self.account_collection.find_one({"id": account_id}, {"_id": 0, "transactions": 0})

        if not account:
            return None

        # TODO: Can I use from json?
        return Account(
            id=account['id'],
            name=account['name'],
            last_update=account['last_update'],
            balances=account['balances']) if account is not None else None

    def find_by_user(self, username: str) -> List[Account]:
        return list(self.account_collection.find({'user': username}, {"_id": 0, "transactions": 0}))

    def update(self, account: Account) -> None:
        account_json = json.loads(account.to_json())
        update_query = [
            {
                "$set": {
                    "balances": account_json["balances"],
                    "last_update": account_json["last_update"]
                }
            }
        ]

        self.account_collection.update_one({"id": account_json["id"]}, update_query, upsert=True)


class MongoTransactionCRUD(TransactionCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.account_collection = self.mongo_client['accounts']

    def add(self, account_id: str, transactions: List[Transaction]) -> None:
        update_query = [
            {
                "$set": {
                    "transactions": {
                        "$concatArrays": [
                            transactions,
                            "$transactions"
                        ]
                    }
                }
            }
        ]
        self.account_collection.update_one({"id": account_id}, update_query, upsert=True)
    
    def update(self, account_id: str, transaction: Transaction) -> None:
        find_query = {"_id": account_id,
                      "transactions.transaction_id": transaction.transaction_id}
        update_query = {
                "$set": {
                    "transactions.$.booking_date": transaction.booking_date,
                    "transactions.$.transaction_amount": transaction.transaction_amount.to_dict(),
                    "transactions.$.origin": transaction.origin,
                    "transactions.$.text": transaction.text,
                    "transactions.$.category": transaction.category,
                    "transactions.$.type": transaction.type,
                    "transactions.$.category_edited": transaction.category_edited
                }
            }
        
        self.account_collection.update_one(find_query, update_query, upsert=True)
    
    def find_by_account(self, account_id: str) -> List[Transaction]:
        # date_to = date_to if date_to != None else datetime.today()
        # account = list(self.account_collection.find({"_id": account_id}, {
        #     "transactions": {
        #         "$filter": {
        #             "input": "$transactions",
        #             "as": "transaction",
        #             "cond": {
        #                 "$and": [
        #                     {"$gte": ["$$transaction.booking_date", date_from.strftime('%Y-%m-%d %H:%M:%S')]},
        #                     {"$lte": ["$$transaction.booking_date", date_to.strftime('%Y-%m-%d %H:%M:%S')]},
        #                 ]
        #             }
        #         }
        #     }
        # }))

        account = self.account_collection.find_one({"id": account_id})

        if not account:
            return []

        return account['transactions']
