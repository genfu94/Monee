from ...database_client import AccountDatabaseClient
from ...bank_sync import BankAccountClient
from ...bank_link_types import BankLinkingDetailsBase
from ...bank_account_types import Transaction, AccountData
from typing import List, Dict
from datetime import datetime
from dateutil.relativedelta import relativedelta


class NordigenBankAccountClient(BankAccountClient):
    def __init__(self, nordigen_client, account_db_client: AccountDatabaseClient):
        self.nordigen_client = nordigen_client
        super().__init__(account_db_client)
      
    def _fetch_bank_account_details(self, bank_linking_details: BankLinkingDetailsBase, account_id: str) -> AccountData:
      stored_account = self.account_db_client.find_account(account_id)
      if stored_account:
          return stored_account
      
      account_api = self.nordigen_client.account_api(id=account_id)
      account_details_json = account_api.get_details()['account']
      
      if account_details_json['status'] == 'deleted':
          return None
      
      return AccountData(
          _id=account_id,
          name=account_details_json['name'],
          bank_linking_details=bank_linking_details
        )

    def fetch_all_bank_accounts(self, bank_linking_details: BankLinkingDetailsBase) -> List[AccountData]:
      bank_accounts = self.nordigen_client.requisition.get_requisition_by_id(
          requisition_id=bank_linking_details.requisition_id
      )

      bank_accounts_info =  [self._fetch_bank_account_details(bank_linking_details, account) for account in bank_accounts['accounts']]
      bank_accounts_info = list(filter(lambda item: item is not None, bank_accounts_info))
      return bank_accounts_info
    
    def get_last_sync_time(self, last_update):
        return datetime.now().replace(hour=(int(last_update.hour / 8)) * 8, minute=0, second=0)
    
    def _fetch_new_transactions(self, account_data: AccountData, last_update: datetime) -> List[Transaction]:
        old_transactions = self.account_db_client.fetch_transactions(account_data, last_update)
        old_transactions_ids = [t['transaction_id'] for t in old_transactions]
        account_api = self.nordigen_client.account_api(id=account_data.id)
        transactions_dict = account_api.get_transactions(date_from=last_update.strftime('%Y-%m-%d'))['transactions']
        transactions_list = transactions_dict['booked'] + transactions_dict['pending']
        transactions = [self._psd2_to_transaction(account_data.id, psd2_trans) for psd2_trans in transactions_list]

        transactions = list(filter(lambda x: x['transaction_id'] not in old_transactions_ids, transactions))

        return transactions
    
    def _psd2_to_transaction(self, account_id: str, psd2_transaction: dict) -> Dict:
        # Returns a dict representation of a bank_sync.types.Transaction object
        return {
            "account_id": account_id,
            "category": "Unknown",
            "type": 'income' if float(psd2_transaction['transactionAmount']['amount']) > 0  else 'expense',
            "transaction_id": psd2_transaction['transactionId'],
            "booking_date": psd2_transaction['bookingDate'] + " 00:00:00",
            "transaction_amount": dict(psd2_transaction['transactionAmount']),
            "origin": psd2_transaction['creditorName'] if 'creditorName' in psd2_transaction else psd2_transaction['debtorName'],
            "text": psd2_transaction['remittanceInformationUnstructured'] if 'remittanceInformationUnstructured' in psd2_transaction else ''
        }

    def fetch_account_updates(self, account_data: AccountData) -> AccountData:
        last_update = datetime.strptime(account_data.last_update, "%Y-%m-%d, %H:%M:%S") if account_data.last_update is not None else datetime.now() - relativedelta(years=1)
        last_sync_time = self.get_last_sync_time(last_update)
        
        if account_data.last_update is None or last_update < last_sync_time:
            account_api = self.nordigen_client.account_api(id=account_data.id)
            balances_dict = account_api.get_balances()['balances'][0]['balanceAmount']
            account_data.balances = [balances_dict]

            account_data.transactions = self._fetch_new_transactions(account_data, last_update)
            account_data.last_update = datetime.now().strftime("%Y-%m-%d, %H:%M:%S")

        return account_data