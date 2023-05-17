from nordigen import NordigenClient
from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import List, Dict
from uuid import uuid4

from .bank_client_interface import (BankSyncClientInterface,
                                    BankLinkClientInterface,
                                    BankAccountClientInterface)
from ..types import (APICredentials,
                     NordigenBankLinkingDetails,
                     BankLinkingDetailsBase,
                     AccountData,
                     Transaction,
                     AccountStatus,
                     InstitutionInfo)
from ..database_client.database_client_interface import AccountDatabaseClient


class NordigenBankAccountClient(BankAccountClientInterface):
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
            id=account_id,
            name=account_details_json['name'],
            bank_linking_details=bank_linking_details
        )

    def fetch_all_bank_accounts(self, bank_linking_details: BankLinkingDetailsBase) -> List[AccountData]:
        bank_accounts = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        bank_accounts_info = [self._fetch_bank_account_details(
            bank_linking_details, account) for account in bank_accounts['accounts']]
        bank_accounts_info = list(
            filter(lambda item: item is not None, bank_accounts_info))
        return bank_accounts_info

    def get_last_sync_time(self, last_update):
        return datetime.now().replace(hour=(int(last_update.hour / 8)) * 8, minute=0, second=0)

    def _fetch_new_transactions(self, account_data: AccountData, last_update: datetime) -> List[Transaction]:
        old_transactions = self.account_db_client.fetch_transactions(
            account_data.id, last_update)
        old_transactions_ids = [t['transaction_id'] for t in old_transactions]
        account_api = self.nordigen_client.account_api(id=account_data.id)
        transactions_dict = account_api.get_transactions(
            date_from=last_update.strftime('%Y-%m-%d'))['transactions']
        transactions_list = transactions_dict['booked'] + \
            transactions_dict['pending']
        transactions = [self._psd2_to_transaction(
            account_data.id, psd2_trans) for psd2_trans in transactions_list]

        transactions = list(
            filter(lambda x: x['transaction_id'] not in old_transactions_ids, transactions))

        return transactions

    def _psd2_to_transaction(self, account_id: str, psd2_transaction: dict) -> Dict:
        # Returns a dict representation of a bank_sync.types.Transaction object
        return {
            "account_id": account_id,
            "category": "Unknown",
            "type": 'income' if float(psd2_transaction['transactionAmount']['amount']) > 0 else 'expense',
            "transaction_id": psd2_transaction['transactionId'],
            "booking_date": psd2_transaction['bookingDate'] + " 00:00:00",
            "transaction_amount": dict(psd2_transaction['transactionAmount']),
            "origin": psd2_transaction['creditorName'] if 'creditorName' in psd2_transaction else psd2_transaction['debtorName'],
            "text": psd2_transaction['remittanceInformationUnstructured'] if 'remittanceInformationUnstructured' in psd2_transaction else ''
        }

    def fetch_account_updates(self, account_data: AccountData) -> AccountData:
        last_update = datetime.strptime(
            account_data.last_update, "%Y-%m-%d, %H:%M:%S") if account_data.last_update is not None else datetime.now() - relativedelta(years=1)
        last_sync_time = self.get_last_sync_time(last_update)

        if account_data.last_update is None or last_update < last_sync_time:
            account_api = self.nordigen_client.account_api(id=account_data.id)
            balances_dict = account_api.get_balances(
            )['balances'][0]['balanceAmount']
            account_data.balances = [balances_dict]

            account_data.transactions = self._fetch_new_transactions(
                account_data, last_update)
            account_data.last_update = datetime.now().strftime("%Y-%m-%d, %H:%M:%S")

        return account_data


class NordigenBankLinkClient(BankLinkClientInterface):
    def __init__(self, nordigen_client, account_db_client: AccountDatabaseClient):
        self.nordigen_link_status_map = {
            "CR": AccountStatus.AUTHORIZATION_REQUIRED,
            "GC": AccountStatus.AUTHORIZATION_REQUIRED,
            "UA": AccountStatus.AUTHORIZATION_REQUIRED,
            "RJ": AccountStatus.AUTHORIZATION_REQUIRED,
            "SA": AccountStatus.AUTHORIZATION_REQUIRED,
            "GA": AccountStatus.AUTHORIZATION_REQUIRED,
            "LN": AccountStatus.LINKED,
            "SU": AccountStatus.LINK_EXPIRED,
            "EX": AccountStatus.LINK_EXPIRED
        }

        self.nordigen_client = nordigen_client
        self.account_db_client = account_db_client

    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
        raw_institutions = self.nordigen_client.institution.get_institutions(
            country_code)
        institution_list = [InstitutionInfo(
            name=r['name'], id=r['id']) for r in raw_institutions]

        return institution_list

    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkingDetailsBase:
        init = self.nordigen_client.initialize_session(
            institution_id=institution.id,
            redirect_uri="http://localhost:3000",
            reference_id=str(uuid4())
        )

        bank_linking_details = NordigenBankLinkingDetails(
            client="Nordigen",
            link=init.link,
            requisition_id=init.requisition_id,
            institution=dict(institution)
        )

        self.account_db_client.add_bank(username, bank_linking_details)

        return bank_linking_details

    def fetch_link_bank_status(self, bank_linking_details: BankLinkingDetailsBase) -> BankLinkingDetailsBase:
        nordigen_bank_link_details_json = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return NordigenBankLinkingDetails(
            client="Nordigen",
            link=nordigen_bank_link_details_json['link'],
            requisition_id=bank_linking_details.requisition_id,
            institution=bank_linking_details.institution,
            status=self.nordigen_link_status_map[nordigen_bank_link_details_json['status']]
        )


class NordigenBankSyncClient(BankSyncClientInterface):
    def __init__(self, nordigen_auth_credentials: APICredentials, account_db_client: AccountDatabaseClient):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None
        super().__init__(account_db_client, None, None)

    def initialize(self):
        if self.nordigen_client != None:
            return

        self.account_db_client.initialize()

        try:
            self.nordigen_client = NordigenClient(
                secret_id=self.nordigen_auth_credentials.secret_id,
                secret_key=self.nordigen_auth_credentials.secret_key
            )

            self.nordigen_client.generate_token()
            self.bank_link_client = NordigenBankLinkClient(
                self.nordigen_client, self.account_db_client)
            self.bank_account_client = NordigenBankAccountClient(
                self.nordigen_client, self.account_db_client)
        except Exception as e:
            print(e)
            self.nordigen_client = None
