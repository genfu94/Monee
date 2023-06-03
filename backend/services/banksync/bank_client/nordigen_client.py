from nordigen import NordigenClient
from datetime import datetime
from typing import List, Dict
from uuid import uuid4
from services.transaction_categorization.algorithms import rule_based_categorization

from .bank_client_interface import (BankSyncClientInterface,
                                    BankLinkClientInterface,
                                    BankAccountClientInterface)
from ..types import (APICredentials,
                     NordigenBankLink,
                     BankLinkBase,
                     Account,
                     Transaction,
                     AccountStatus,
                     InstitutionInfo)


class NordigenBankAccountClient(BankAccountClientInterface):
    def __init__(self, nordigen_client):
        self.nordigen_client = nordigen_client

    def fetch_transactions(self, account: Account, date_start: datetime = None, date_end: datetime = None) -> List[Transaction]:
        account_api = self.nordigen_client.account_api(id=account.id)
        transactions_raw = account_api.get_transactions(
            date_from=date_start, date_to=date_end)['transactions']
        transactions_list = transactions_raw['booked'] + transactions_raw['pending']
        transactions = [self._psd2_to_transaction(account.id, t) for t in transactions_list]

        return transactions
    
    def fetch_account(self, account_id: str) -> Account:
        account_api = self.nordigen_client.account_api(id=account_id)
        account_details_json = account_api.get_details()['account']

        if 'status' in account_details_json and account_details_json['status'] == 'deleted':
            return None

        balances_dict = account_api.get_balances()['balances'][0]['balanceAmount']

        return Account(
            id=account_id,
            name=account_details_json['name'],
            balances=[balances_dict]
        )

    # TODO: Refactoring!! Maybe use pydantic to do this automatically?
    def _psd2_to_transaction(self, account_id: str, psd2_transaction: Dict) -> Transaction:
        origin = ''
        if 'creditorName' in psd2_transaction:
            origin = psd2_transaction['creditorName']
        if 'debtorName' in psd2_transaction:
            origin = psd2_transaction['debtorName']
        text = psd2_transaction['remittanceInformationUnstructured'] if 'remittanceInformationUnstructured' in psd2_transaction else ''
        
        return {
            "account_id": account_id,
            "type": 'income' if float(psd2_transaction['transactionAmount']['amount']) > 0 else 'expense',
            "transaction_id": psd2_transaction['transactionId'],
            "booking_date": psd2_transaction['bookingDate'] + " 00:00:00",
            "transaction_amount": dict(psd2_transaction['transactionAmount']),
            "origin": origin,
            "text": text
        }


class NordigenBankLinkClient(BankLinkClientInterface):
    def __init__(self, nordigen_client):
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

    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
        raw_institutions = self.nordigen_client.institution.get_institutions(
            country_code)
        institution_list = [InstitutionInfo(
            name=r['name'], id=r['id']) for r in raw_institutions]

        return institution_list

    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkBase:
        init = self.nordigen_client.initialize_session(
            institution_id=institution.id,
            redirect_uri="http://localhost:3000",
            reference_id=str(uuid4())
        )

        bank_linking_details = NordigenBankLink(
            client="Nordigen",
            link=init.link,
            requisition_id=init.requisition_id,
            institution=dict(institution)
        )

        return bank_linking_details

    def fetch_link_bank_status(self, bank_linking_details: BankLinkBase) -> BankLinkBase:
        nordigen_bank_link_details_json = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return NordigenBankLink(
            client="Nordigen",
            link=nordigen_bank_link_details_json['link'],
            requisition_id=bank_linking_details.requisition_id,
            institution=bank_linking_details.institution,
            status=self.nordigen_link_status_map[nordigen_bank_link_details_json['status']]
        )


    def fetch_account_ids_from_bank_link(self, bank_linking_details: BankLinkBase) -> List[str]:
        account_id_list = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return account_id_list['accounts']


class NordigenBankSyncClient(BankSyncClientInterface):
    def __init__(self, nordigen_auth_credentials: APICredentials):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None

    def initialize(self):
        if self.nordigen_client != None:
            return

        try:
            self.nordigen_client = NordigenClient(
                secret_id=self.nordigen_auth_credentials.secret_id,
                secret_key=self.nordigen_auth_credentials.secret_key
            )

            self.nordigen_client.generate_token()
            self.bank_link_client = NordigenBankLinkClient(
                self.nordigen_client)
            self.bank_account_client = NordigenBankAccountClient(
                self.nordigen_client)
        except Exception as e:
            print(e)
            self.nordigen_client = None
