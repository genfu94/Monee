from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from pydantic import BaseModel, validator, Field
from enum import Enum
from typing import List, Union, Dict
from abc import ABC, abstractmethod


class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


class InstitutionInfo(BaseModel):
    name: str
    id: str


class BankLinkingDetailsBase(BaseModel, ABC):
    client: str

    @abstractmethod
    def get_identifiers(self):
        pass


class NordigenBankLinkingDetails(BankLinkingDetailsBase):
    requisition_id: str
    institution: InstitutionInfo
    link: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED

    def get_identifiers(self):
        return {
            'requisition_id': self.requisition_id
        }


BankLinkingDetails = Union[NordigenBankLinkingDetails, BankLinkingDetailsBase]


class Balance(BaseModel):
    currency: str
    amount: float


class Transaction(BaseModel):
    transaction_id: str
    booking_date: str
    transaction_amount: Balance
    origin: str
    text: str
    category: str
    type: str


class AccountData(BaseModel):
    id: str = Field(..., alias='_id')
    name: str
    last_update: str = None
    bank_linking_details: NordigenBankLinkingDetails | BankLinkingDetailsBase = None
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
