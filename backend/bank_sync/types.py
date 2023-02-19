from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from pydantic import BaseModel
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
    link: str
    requisition_id: str
    institution: InstitutionInfo
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED


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


@dataclass
class Balance:
    currency: str
    amount: float


@dataclass
class Transaction:
    pass


@dataclass_json
@dataclass
class AccountData:
    bank: str
    account_name: str = None
    balances: List[Balance] = field(default_factory=list)
    transactions: List[Transaction] = field(default_factory=list)