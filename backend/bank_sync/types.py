from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from pydantic import BaseModel, validator
from enum import Enum
from typing import List


class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


class BankLinkingDetails(BaseModel):
    client: str


class InstitutionInfo(BaseModel):
    name: str
    id: str


class NordigenBankLinkingDetails(BankLinkingDetails):
    requisition_id: str
    institution: InstitutionInfo
    link: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED


class Balance(BaseModel):
    currency: str
    amount: float


class Transaction(BaseModel):
    pass


class AccountData(BaseModel):
    account_id: str
    account_name: str
    bank_linking_details: BankLinkingDetails
    balances: List[Balance] = []
    transactions: List[Transaction] = []


@dataclass_json
@dataclass
class AccountSyncInfo:
    pass


@dataclass_json
@dataclass
class NordigenAccountSyncInfo(AccountSyncInfo):
    requisition_id: str
    account_id: str


@dataclass
class APICredentials:
    secret_id: str
    secret_key: str
