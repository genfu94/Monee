from abc import ABC, abstractmethod

from models.bank import (
    Account,
    BankLink,
    NordigenBankLink,
    InstitutionInfo,
    AccountStatus,
    Account,
    Transaction,
    Bank,
    BankList,
    TransactionList,
)
from typing import List


class BankCRUD(ABC):
    @abstractmethod
    def add(self, username: str, bank_link: BankLink):
        pass

    @abstractmethod
    def find_by_id(self, bank_id: str) -> Bank:
        pass

    @abstractmethod
    def find_by_user(self, username: str) -> List[Bank]:
        pass

    @abstractmethod
    def update(self, bank: Bank):
        pass

    @abstractmethod
    def delete_unauthorized(self, username: str):
        pass

    @abstractmethod
    def add_account(self, id: str, account: Account):
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


class MongoBankCRUD(BankCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.bank_collection = self.mongo_client["banks"]

    def add(self, username: str, institution: InstitutionInfo, bank_link: BankLink) -> None:
        bank_link_json = bank_link.model_dump()
        bank_link_json["user"] = username
        bank_link = NordigenBankLink.model_validate(bank_link_json)
        bank = Bank(link=bank_link, institution=institution, accounts=[])
        self.bank_collection.insert_one(bank)

    def find_by_id(self, bank_id: str) -> Bank:
        return Bank.model_validate(self.bank_collection.find_one({"_id": bank_id}))

    def find_by_user(self, username: str) -> List[Bank]:
        bank_list = list(self.bank_collection.find({"user": username}))
        print("Bank list", bank_list)
        return BankList.validate_python(bank_list)

    def update(self, bank: Bank) -> None:
        update_query = {"$set": bank}
        self.bank_collection.update_one({"_id": bank.id}, update_query)

    def delete_unauthorized(self, username):
        remove_query = {"user": username, "link": {"status": AccountStatus.AUTHORIZATION_REQUIRED}}
        self.bank_collection.delete_many(remove_query)

    def add_account(self, id: str, account: Account):
        query = {
            "$set": {
                "accounts": {
                    "$concatArrays": [
                        account.model_dump(),
                        "$accounts",
                    ]
                }
            }
        }

        self.bank_collection.update_one({"_id": id}, query)


class MongoTransactionCRUD(TransactionCRUD):
    def __init__(self, mongo_client):
        self.mongo_client = mongo_client
        self.transaction_collection = self.mongo_client["transactions"]

    def add(self, account: Account, transactions: TransactionList):
        transactions = [Transaction.model_dump(t, by_alias=True) for t in transactions]
        try:
            self.transaction_collection.insert_many(transactions)
        except Exception as e:
            print("There was an exception when adding new transactions")

    def update(self, account_id: str, transaction: Transaction) -> None:
        find_query = {"_id": account_id, "transactions.id": transaction.id}
        update_query = {
            "$set": {
                "transactions.$.booking_date": transaction.booking_date,
                "transactions.$.transaction_amount": transaction.transaction_amount.to_dict(),
                "transactions.$.origin": transaction.origin,
                "transactions.$.text": transaction.text,
                "transactions.$.category": transaction.category,
                "transactions.$.type": transaction.type,
                "transactions.$.category_edited": transaction.category_edited,
            }
        }

        self.account_collection.update_one(find_query, update_query, upsert=True)

    def find_by_account(self, account_id: str) -> List[Transaction]:
        account_transactions = list(self.transaction_collection.find({"account._id": account_id}))
        return TransactionList.validate_python(account_transactions)
