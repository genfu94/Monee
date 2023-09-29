from abc import ABC, abstractmethod

import schemas
import models.mongo as mongo_models
from typing import List, Dict
from datetime import datetime


class BankLinkCRUD(ABC):
    @abstractmethod
    def add(self, username: str, bank_link: schemas.BankLink) -> None:
        pass

    @abstractmethod
    def find_by_id(self, bank_link_id: str) -> schemas.BankLink:
        pass

    @abstractmethod
    def find_by_user(self, username: str) -> List[schemas.BankLink]:
        pass

    @abstractmethod
    def update(self, bank_link: schemas.BankLink) -> None:
        pass

    @abstractmethod
    def delete_unauthorized_links(self, username) -> None:
        pass


class AccountCRUD(ABC):
    @abstractmethod
    def add(
        self,
        username: str,
        bank_link: schemas.BankLink,
        account: schemas.Account,
        upsert=False,
    ) -> None:
        pass

    @abstractmethod
    def find_by_id(self, account_id: str) -> schemas.Account:
        pass

    @abstractmethod
    def find_by_user(self, username: str) -> List[schemas.Account]:
        pass

    @abstractmethod
    def update(self, account: schemas.Account) -> None:
        pass


class TransactionCRUD(ABC):
    @abstractmethod
    def add(self, account_id: str, transactions: List[schemas.Transaction]) -> None:
        pass

    @abstractmethod
    def update(self, transaction: schemas.Transaction) -> None:
        pass

    @abstractmethod
    def find_by_account(self, account_id: str) -> List[schemas.Transaction]:
        pass


class MongoBankLinkCRUD(BankLinkCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.bank_link_collection = self.mongo_client["bank_links"]

    def add(self, username: str, bank_link: schemas.BankLink) -> None:
        bank_link_json = bank_link.model_dump()
        bank_link_json["user"] = username
        self.bank_link_collection.insert_one(bank_link_json)

    def find_by_id(self, bank_link_id: str) -> schemas.BankLink:
        return schemas.BankLink.model_validate(
            self.bank_link_collection.find_one({"id": bank_link_id}, {"_id": 0})
        )

    def find_by_user(self, username: str) -> List[schemas.BankLink]:
        bank_link_list = self.bank_link_collection.find({"user": username})
        return [
            schemas.BankLink.model_validate(bank_link) for bank_link in bank_link_list
        ]

    def update(self, bank_link: schemas.BankLink) -> None:
        filter_query = {"requisition_id": bank_link.requisition_id}
        update_query = {"$set": {"status": bank_link.status}}
        self.bank_link_collection.update_one(filter_query, update_query)

    def delete_unauthorized_links(self, username) -> None:
        remove_query = {
            "user": username,
            "status": mongo_models.AccountStatus.AUTHORIZATION_REQUIRED,
        }
        self.bank_link_collection.delete_many(remove_query)


class MongoAccountCRUD(AccountCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.account_collection = self.mongo_client["accounts"]

    def add(
        self,
        username: str,
        bank_link: schemas.BankLink,
        account: schemas.Account,
        upsert=False,
    ) -> None:
        if upsert and self.find_by_id(account.id):
            self.update(account)
            return

        account.institution = bank_link.institution
        account = account.model_dump()
        account["user"] = username
        account["transactions"] = []
        self.account_collection.insert_one(account)

    def find_by_id(self, account_id: str) -> schemas.Account:
        account = self.account_collection.find_one(
            {"id": account_id}, {"_id": 0, "transactions": 0}
        )
        return schemas.Account.model_validate(account) if account else None

    def find_by_user(self, username: str) -> List[schemas.Account]:
        raw_accounts = self.account_collection.find(
            {"user": username}, {"_id": 0, "transactions": 0}
        )
        return [schemas.Account.model_validate(acc) for acc in raw_accounts]

    def update(self, account: schemas.Account) -> None:
        account_json = account.model_dump()
        update_query = [
            {
                "$set": {
                    "balances": account_json["balances"],
                    "last_update": datetime.now(),
                }
            }
        ]

        self.account_collection.update_one(
            {"id": account_json["id"]}, update_query, upsert=True
        )


class MongoTransactionCRUD(TransactionCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.transaction_collection = self.mongo_client["transactions"]

    def add(self, account_id: str, transactions: List[schemas.Transaction]) -> None:
        if len(transactions) == 0:
            return

        transaction_dicts = [t.model_dump() for t in transactions]
        for i in range(len(transaction_dicts)):
            transaction_dicts[i]["account_id"] = account_id

        self.transaction_collection.insert_many(transaction_dicts)

    def update(self, account_id: str, transaction: schemas.Transaction) -> None:
        find_query = {"id": transaction.id}

        update_query = {
            "$set": {
                "booking_date": transaction.booking_date,
                "amount": transaction.amount.model_dump(),
                "origin": transaction.origin,
                "text": transaction.text,
                "category": transaction.category,
                "type": transaction.type,
                "category_edited": transaction.category_edited,
            }
        }

        self.transaction_collection.update_one(find_query, update_query)

    def find_by_account(self, account_id: str) -> List[schemas.Transaction]:
        transactions = self.transaction_collection.find({"account_id": account_id})
        return [schemas.Transaction.model_validate(t) for t in transactions]
