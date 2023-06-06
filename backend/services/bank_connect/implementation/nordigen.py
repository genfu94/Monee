from nordigen import NordigenClient
from datetime import datetime
from typing import List, Dict
from uuid import uuid4

from ..bank_connect import (BankConnector, BankLinkAPI, BankAccountAPI)

from ..types import (APICredentials,
                     NordigenBankLink,
                     BankLink,
                     Account,
                     Transaction,
                     AccountStatus,
                     InstitutionInfo)


def _is_account_valid(nordigen_client, account_id: str) -> Dict:
    account_api = nordigen_client.account_api(id=account_id)
    account_json = account_api.get_details()['account']

    if 'status' in account_json and account_json['status'] == 'deleted':
        return None

    return account_json


class NordigenBankAccountClient(BankAccountAPI):
    def __init__(self, nordigen_client):
        self.nordigen_client = nordigen_client

    def fetch_transactions(self, account_id: str, date_start: datetime = None, date_end: datetime = None) -> List[Transaction]:
        account_api = self.nordigen_client.account_api(id=account_id)
        date_start = date_start.strftime('%Y-%m-%d') if date_start else None
        date_end = date_end.strftime('%Y-%m-%d') if date_end else None
        transactions_raw = account_api.get_transactions(
            date_from=date_start, date_to=date_end)['transactions']
        transactions_list = transactions_raw['booked'] + \
            transactions_raw['pending']
        
        current_amount = self.fetch_account(account_id).balances[0].amount
        transactions = []
        for t in transactions_list:
            transactions.append(self._psd2_to_transaction(account_id, t, current_amount))
            current_amount = transactions[-1].account_balance - transactions[-1].transaction_amount.amount

        return transactions

    def fetch_account(self, account_id: str) -> Account:
        account_api = self.nordigen_client.account_api(id=account_id)
        account_json = _is_account_valid(self.nordigen_client, account_id)

        if not account_json:
            return None

        balances_dict = account_api.get_balances(
        )['balances'][0]['balanceAmount']

        return Account(
            id=account_id,
            name=account_json['name'],
            balances=[balances_dict]
        )

    def _psd2_to_transaction(self, account_id: str, psd2_transaction: Dict, last_balance: float) -> Transaction:
        origin = ''
        if 'creditorName' in psd2_transaction:
            origin = psd2_transaction['creditorName']
        if 'debtorName' in psd2_transaction:
            origin = psd2_transaction['debtorName']
        text = psd2_transaction['remittanceInformationUnstructured'] if 'remittanceInformationUnstructured' in psd2_transaction else ''

        return Transaction.parse_obj({
            "account_id": account_id,
            "type": 'income' if float(psd2_transaction['transactionAmount']['amount']) > 0 else 'expense',
            "id": psd2_transaction['transactionId'],
            "booking_date": psd2_transaction['bookingDate'] + " 00:00:00",
            "transaction_amount": dict(psd2_transaction['transactionAmount']),
            "account_balance": last_balance,
            "origin": origin,
            "text": text,
            "category": "unknown"
        })


class NordigenBankLinkClient(BankLinkAPI):
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

    def link_bank(self, institution: InstitutionInfo) -> BankLink:
        init = self.nordigen_client.initialize_session(
            institution_id=institution.id,
            redirect_uri="http://localhost:3000",
            reference_id=str(uuid4())
        )

        bank_linking_details = NordigenBankLink(
            client="Nordigen",
            link=init.link,
            requisition_id=init.requisition_id,
            institution=institution
        )

        return bank_linking_details

    def fetch_link_bank_status(self, bank_link: BankLink) -> BankLink:
        nordigen_bank_link = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_link.requisition_id
        )

        return NordigenBankLink(
            client="Nordigen",
            link=nordigen_bank_link['link'],
            requisition_id=bank_link.requisition_id,
            institution=bank_link.institution,
            status=self.nordigen_link_status_map[nordigen_bank_link['status']]
        )

    def fetch_account_ids_from_bank_link(self, bank_linking_details: BankLink) -> List[str]:
        account_id_list = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return filter(lambda a: _is_account_valid(self.nordigen_client, a), account_id_list['accounts'])


class NordigenBankSyncClient(BankConnector):
    def __init__(self, nordigen_auth_credentials: APICredentials):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None

        try:
            self.nordigen_client = NordigenClient(
                secret_id=self.nordigen_auth_credentials.secret_id,
                secret_key=self.nordigen_auth_credentials.secret_key
            )

            self.nordigen_client.generate_token()
        except Exception as e:
            print(e)
            self.nordigen_client = None

        super().__init__(NordigenBankLinkClient(self.nordigen_client),
                         NordigenBankAccountClient(self.nordigen_client))
