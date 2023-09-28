from .bank_connect.bank_connect import BankConnector
from .database_crud import AccountCRUD, TransactionCRUD, BankLinkCRUD
from schemas import BankLink, Account, Transaction, CurrencyAmount
from typing import Tuple, List
from .transaction_categorization.algorithms import categorize

from datetime import datetime
from dateutil.relativedelta import relativedelta


class BankSync:
    def __init__(
        self,
        bank_connector: BankConnector,
        account_crud: AccountCRUD,
        transaction_crud: TransactionCRUD,
        bank_link_crud: BankLinkCRUD,
    ):
        self.bank_connector = bank_connector
        self.account_crud = account_crud
        self.transaction_crud = transaction_crud
        self.bank_link_crud = bank_link_crud

    def get_last_sync_time(self, last_update):
        return datetime.now().replace(
            hour=(int(last_update.hour / 8)) * 8, minute=0, second=0
        )

    # TODO: Refactor this method
    def fetch_account_updates(
        self, account_id: str, link: BankLink
    ) -> Tuple[Account, List[Transaction]]:
        account = self.account_crud.find_by_id(account_id)

        if not account:
            account = self.bank_connector.bank_account_api.fetch_account(account_id)
            account.institution = link.institution

        last_update = (
            account.last_update
            if account.last_update
            else datetime.now() - relativedelta(years=1)
        )

        last_sync_time = self.get_last_sync_time(last_update)
        new_transactions = []
        if last_update < last_sync_time:
            old_transactions = self.transaction_crud.find_by_account(account_id)
            old_transactions_ids = [t.id for t in old_transactions]
            new_transactions = self.bank_connector.bank_account_api.fetch_transactions(
                account_id, last_update
            )
            new_transactions = list(
                filter(lambda x: x.id not in old_transactions_ids, new_transactions)
            )

            for i in range(len(new_transactions)):
                new_transactions[i].category = categorize(
                    new_transactions[i], old_transactions
                ).value

            account.last_update = datetime.now()
            new_account_info = self.bank_connector.bank_account_api.fetch_account(
                account_id
            )
            account.balances = new_account_info.balances

        return account, new_transactions

    def update_bank_links(self, username: str):
        for bank_link_status in self.bank_link_crud.find_by_user(username):
            bank_linking_details = (
                self.bank_connector.bank_link_api.fetch_link_bank_status(
                    bank_link_status
                )
            )
            self.bank_link_crud.update(bank_linking_details)

        self.bank_link_crud.delete_unauthorized_links(username)

    def synchronize_user_accounts(self, username: str):
        user_bank_links = self.bank_link_crud.find_by_user(username)
        for link in user_bank_links:
            for (
                account_id
            ) in self.bank_connector.bank_link_api.fetch_account_ids_from_bank_link(
                link
            ):
                account, transactions = self.fetch_account_updates(account_id, link)
                self.account_crud.add(username, link, account, upsert=True)
                self.transaction_crud.add(account_id, transactions)
