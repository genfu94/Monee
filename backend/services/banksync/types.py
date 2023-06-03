from enum import Enum
from typing import Union, List
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from pydantic import BaseModel

class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


@dataclass
class APICredentials:
    secret_id: str
    secret_key: str


class InstitutionInfo(BaseModel):
    name: str
    id: str


@dataclass_json
@dataclass
class BankLinkingDetailsBase(ABC):
    client: str

    @abstractmethod
    def get_identifiers(self):
        pass

@dataclass_json
@dataclass
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

@dataclass_json
@dataclass
class Balance:
    currency: str
    amount: float


@dataclass
class Transaction:
    transaction_id: str
    booking_date: str
    transaction_amount: Balance
    origin: str
    text: str
    category: str
    type: str
    category_edited: bool

@dataclass_json
@dataclass
class Account:
    id: str
    name: str
    last_update: str = None
    bank_linking_details: BankLinkingDetails = None
    balances: List[Balance] = field(default_factory=lambda : [])
    transactions: List[Transaction] = field(default_factory=lambda : [])