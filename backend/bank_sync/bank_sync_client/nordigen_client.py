from nordigen import NordigenClient
from .bank_sync import BankSyncClient
from ..types import InstitutionInfo, BankLinkingDetailsBase, AccountData, APICredentials, NordigenBankLinkingDetails, AccountStatus, Balance, Transaction
from ..database_client.database_client import AccountDatabaseClient
from typing import List, Dict
from uuid import uuid4


class NordigenBankSyncClient(BankSyncClient):
    def __init__(self, nordigen_auth_credentials: APICredentials, account_db_client: AccountDatabaseClient):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None
        super().__init__(account_db_client)

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

    def initialize(self):
        if self.nordigen_client != None:
            return

        self.account_db_client.initialize()
        
        self.nordigen_client = NordigenClient(
            secret_id = self.nordigen_auth_credentials.secret_id,
            secret_key=self.nordigen_auth_credentials.secret_key
        )

        self.nordigen_client.generate_token()
    
    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
        raw_institutions = self.nordigen_client.institution.get_institutions(country_code)
        institution_list = [InstitutionInfo.parse_obj(r) for r in raw_institutions]

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
            institution=institution
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

    def _fetch_bank_account_details(self, bank_linking_details: BankLinkingDetailsBase, account_id: str) -> AccountData:
        account_api = self.nordigen_client.account_api(id=account_id)
        account_details_json = account_api.get_details()['account']
        
        if account_details_json['status'] == 'deleted':
            return None
        
        return AccountData(
            account_id=account_id,
            account_name=account_details_json['name'],
            bank_linking_details=bank_linking_details
        )

    def fetch_all_bank_accounts(self, bank_linking_details: BankLinkingDetailsBase) -> List[AccountData]:
        bank_accounts = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return [self._fetch_bank_account_details(bank_linking_details, account) for account in bank_accounts['accounts']]

    def _psd2_to_transaction(self, psd2_transaction: dict) -> Dict:
        # Returns a dict representation of a bank_sync.types.Transaction object
        return {
            "transaction_id": psd2_transaction['transactionId'],
            "booking_date": psd2_transaction['bookingDate'],
            "transaction_amount": dict(psd2_transaction['transactionAmount']),
            "origin": psd2_transaction['creditorName'] if 'creditorName' in psd2_transaction else psd2_transaction['debtorName'],
            "text": psd2_transaction['remittanceInformationUnstructured'] if 'remittanceInformationUnstructured' in psd2_transaction else ''
        }

    def fetch_account_updates(self, account_data: AccountData) -> AccountData:
        account_api = self.nordigen_client.account_api(id=account_data.account_id)
        balances_dict = account_api.get_balances()['balances'][0]['balanceAmount']
        account_data.balances.append(balances_dict)

        transactions_dict = account_api.get_transactions()['transactions']
        transactions_list = transactions_dict['booked'] + transactions_dict['pending']

        account_data.transactions = {psd2_trans['transactionId']:self._psd2_to_transaction(psd2_trans) for psd2_trans in transactions_list}
        return account_data
