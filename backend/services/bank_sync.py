from .bank_connect.bank_connect import BankConnector
from database.database_crud import BankCRUD, TransactionCRUD
from models.bank import BankLink, Account, Transaction, AccountStatus, TransactionList
from typing import Tuple, List
from .transaction_categorization.algorithms import categorize

from datetime import datetime


class BankSync:
    def __init__(
        self,
        bank_connector: BankConnector,
        bank_crud: BankCRUD,
        transaction_crud: TransactionCRUD,
    ):
        self.bank_connector = bank_connector
        self.transaction_crud = transaction_crud
        self.bank_crud = bank_crud

    def get_last_sync_time(self, last_update):
        return datetime.now().replace(hour=(int(last_update.hour / 8)) * 8, minute=0, second=0)

    # TODO: Refactor this method
    def fetch_account_updates(self, account: Account, link: BankLink) -> Tuple[Account, List[Transaction]]:
        last_sync_time = self.get_last_sync_time(account.last_update)
        if account.last_update < last_sync_time:
            new_transactions = self.bank_connector.bank_account_api.fetch_transactions(account, account.last_update)
            self.transaction_crud.add(account.id, new_transactions)
        #     for i in range(len(new_transactions)):
        #         new_transactions[i].category = categorize(new_transactions[i], old_transactions).value

        #     account.last_update = datetime.now()
        #     new_account_info = self.bank_connector.bank_account_api.fetch_account(account_id)
        #     account.balances = new_account_info.balances

        # return account, new_transactions
        return [], []

    def update_bank_links(self, username: str):
        for bank in self.bank_crud.find_by_user(username):
            if bank.link.status == AccountStatus.AUTHORIZATION_REQUIRED:
                # TODO: Fetch accounts and add to bank object
                bank.link.status = self.bank_connector.bank_link_api.fetch_link_bank_status(bank.link)
                self.bank_crud.update(bank)

        # TODO: Delete only if there is a bank link that is still unauthorized
        self.bank_crud.delete_unauthorized(username)

    def synchronize_user_accounts(self, username: str):
        user_banks = self.bank_crud.find_by_user(username)
        for bank in user_banks:
            for account in bank.accounts:
                self.fetch_account_updates(account, bank.link)
