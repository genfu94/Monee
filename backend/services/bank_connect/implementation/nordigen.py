from nordigen import NordigenClient
from datetime import datetime
from typing import List, Dict, Optional
from uuid import uuid4
from dataclasses import dataclass
from pydantic import BaseModel, Field

from ..bank_connect import BankConnector, BankLinkAPI, BankAccountAPI

from models.bank import (
    NordigenBankLink,
    BankLink,
    Account,
    Transaction,
    AccountStatus,
    InstitutionInfo,
    DateField,
    Amount,
    TransactionList,
)


@dataclass
class APICredentials:
    secret_id: str
    secret_key: str


class NordigenPSD2CreditorAccount(BaseModel):
    iban: str


class NordigenPSD2Transaction(BaseModel):
    transaction_id: str = Field(str, alias="transactionId")
    booking_date: DateField = Field(DateField, alias="bookingDate")
    value_date: DateField = Field(DateField, alias="valueDate")
    transaction_amount: Amount = Field(Amount, alias="transactionAmount")
    creditor_name: str = Field(str, alias="creditorName")
    debtor_name: Optional[str] = Field(str, alias="debtorName")
    debtor_account: Optional[NordigenPSD2CreditorAccount] = Field(NordigenPSD2CreditorAccount, alias="debtorAccount")
    creditor_account: NordigenPSD2CreditorAccount = Field(NordigenPSD2CreditorAccount, alias="creditorAccount")
    remittance_information_unstructured: str = Field(str, alias="remittanceInformationUnstructured")
    bank_transaction_code: str = Field(str, alias="bankTransactionCode")

    def to_transaction(self) -> Transaction:
        text = str(self.remittance_information_unstructured) if self.remittance_information_unstructured != "" else None
        type = "income" if int(self.transaction_amount.amount) > 0 else "expense"
        if type == "expense":
            origin = self.creditor_name if self.creditor_name else self.creditor_account.iban
        else:
            origin = self.debtor_name if self.debtor_name else self.debtor_account.iban
        return Transaction(
            _id=self.transaction_id,
            origin=origin,
            text=text,
            transaction_amount=self.transaction_amount,
            type=type,
            booking_date=self.booking_date,
        )


def _is_account_valid(nordigen_client, account_id: str) -> Dict:
    account_api = nordigen_client.account_api(id=account_id)
    account_json = account_api.get_details()["account"]

    if "status" in account_json and account_json["status"] == "deleted":
        return None

    return account_json


# TODO: Organize this class a little bit better
class NordigenBankAccountClient(BankAccountAPI):
    def __init__(self, nordigen_client):
        self.nordigen_client = nordigen_client

    def fetch_transactions(
        self, account: Account, date_start: datetime = None, date_end: datetime = None
    ) -> List[Transaction]:
        account_api = self.nordigen_client.account_api(id=account.id)
        date_start = date_start.strftime("%Y-%m-%d") if date_start else None
        date_end = date_end.strftime("%Y-%m-%d") if date_end else None
        transactions_raw = account_api.get_transactions(date_from=date_start, date_to=date_end)["transactions"]
        transactions_list = transactions_raw["booked"] + transactions_raw["pending"]
        current_amount = self.fetch_account(account.id).balances[0].amount
        transactions = []
        for t in transactions_list:
            transactions.append(self._psd2_to_transaction(account, t, current_amount))
            # current_amount = transactions[-1].account_balance - transactions[-1].transaction_amount.amount

        transactions = TransactionList.validate_python(transactions)
        return transactions

    def fetch_account(self, account_id: str) -> Account:
        account_api = self.nordigen_client.account_api(id=account_id)
        account_json = _is_account_valid(self.nordigen_client, account_id)

        if not account_json:
            return None

        balances_dict = account_api.get_balances()["balances"][0]["balanceAmount"]
        account_name = account_json["name"] if "name" in account_json else account_json["iban"]
        return Account(_id=account_id, name=account_name, balances=[balances_dict])

    def _psd2_to_transaction(self, account: Account, psd2_transaction: Dict, last_balance: float) -> Transaction:
        psd2_transaction["account"] = {"id": account.id, "name": account.name}
        transaction_obj = NordigenPSD2Transaction.model_validate(psd2_transaction)
        return transaction_obj.to_transaction()


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
            "EX": AccountStatus.LINK_EXPIRED,
        }

        self.nordigen_client = nordigen_client

    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
        raw_institutions = self.nordigen_client.institution.get_institutions(country_code)
        institution_list = [InstitutionInfo(name=r["name"], id=r["id"], logo=r["logo"]) for r in raw_institutions]

        return institution_list

    def link_bank(self, institution: InstitutionInfo) -> BankLink:
        init = self.nordigen_client.initialize_session(
            institution_id=institution.id,
            redirect_uri="http://localhost:3000",
            reference_id=str(uuid4()),
        )

        bank_linking_details = NordigenBankLink(
            client="Nordigen",
            link=init.link,
            requisition_id=init.requisition_id,
            institution=institution,
        )

        return bank_linking_details

    def fetch_link_bank_status(self, bank_link: BankLink) -> AccountStatus:
        nordigen_bank_link = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_link.requisition_id
        )

        return self.nordigen_link_status_map[nordigen_bank_link["status"]]

    def fetch_account_ids_from_bank_link(self, bank_linking_details: BankLink) -> List[str]:
        account_id_list = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return filter(
            lambda a: _is_account_valid(self.nordigen_client, a),
            account_id_list["accounts"],
        )


class NordigenBankSyncClient(BankConnector):
    def __init__(self, nordigen_auth_credentials: APICredentials):
        self.nordigen_auth_credentials = nordigen_auth_credentials
        self.nordigen_client = None

        try:
            self.nordigen_client = NordigenClient(
                secret_id=self.nordigen_auth_credentials.secret_id,
                secret_key=self.nordigen_auth_credentials.secret_key,
            )

            self.nordigen_client.generate_token()
        except Exception as e:
            print(e)
            self.nordigen_client = None

        super().__init__(
            NordigenBankLinkClient(self.nordigen_client),
            NordigenBankAccountClient(self.nordigen_client),
        )
