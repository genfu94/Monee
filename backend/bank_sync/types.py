from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from pydantic import BaseModel
from enum import Enum
from typing import List


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



class BankLinkingDetails(BaseModel):
    pass


class InstitutionInfo(BaseModel):
    name: str
    id: str


class NordigenBankLinkingDetails(BankLinkingDetails):
    link: str
    requisition_id: str
    institution: InstitutionInfo


@dataclass
class Balance:
    currency: str
    amount: float


@dataclass
class Transaction:
    pass


@dataclass
class AccountStatus:
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


@dataclass_json
@dataclass
class AccountData:
    bank: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED
    account_name: str = None
    balances: List[Balance] = field(default_factory=list)
    transactions: List[Transaction] = field(default_factory=list)