from enum import Enum
from typing import Union, List
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from pydantic import BaseModel, validator
from datetime import datetime

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


class BankLinkBase(BaseModel):
    client: str

    @abstractmethod
    def get_identifiers(self):
        pass


class NordigenBankLink(BankLinkBase):
    requisition_id: str
    institution: InstitutionInfo
    link: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED

    def get_identifiers(self):
        return {
            'requisition_id': self.requisition_id
        }
    
    class Config:
        json_encoders = {
            InstitutionInfo: lambda i: i.dict()
        }

BankLink = Union[NordigenBankLink, BankLinkBase]


class Balance(BaseModel):
    currency: str
    amount: float


class Transaction(BaseModel):
    id: str
    origin: str
    text: str
    transaction_amount: Balance = None
    type: str = None
    booking_date: datetime = None
    account_balance: float = None
    category: str = None
    category_edited: bool = None

    @validator('booking_date')
    def convert_datetime(cls, v):
        try:
            return datetime.strptime(v, "%Y-%m-%d, %H:%M:%S")
        except Exception as e:
            return v

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.strftime("%Y-%m-%d, %H:%M:%S"),
            Balance: lambda b: b.dict()
        }


class Account(BaseModel):
    id: str
    name: str
    institution_name: str = None
    last_update: datetime = None
    balances: List[Balance] = []

    @validator('last_update')
    def convert_datetime(cls, v):
        try:
            return datetime.strptime(v, "%Y-%m-%d, %H:%M:%S")
        except Exception as e:
            return v

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.strftime("%Y-%m-%d, %H:%M:%S"),
            Balance: lambda b: b.dict()
        }