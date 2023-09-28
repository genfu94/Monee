from pydantic import BaseModel
from typing import List, Optional, Any, Union
from enum import Enum
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class UserRegistration(BaseModel):
    username: str
    password: str


class APICredentials(BaseModel):
    secret_id: str
    secret_key: str


class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


class InstitutionInfo(BaseModel):
    name: str
    logo: Optional[str] = None


class BankLinkBase(BaseModel):
    client: str


class NordigenBankLink(BankLinkBase):
    requisition_id: str
    institution: InstitutionInfo
    link: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED


BankLink = NordigenBankLink


class CurrencyAmount(BaseModel):
    currency: str
    amount: float


class Transaction(BaseModel):
    id: Any
    origin: str
    amount: CurrencyAmount
    type: str
    booking_date: datetime
    category: str = None
    category_edited: bool = False
    text: Union[str, None] = None
    account_balance: float = None


class Account(BaseModel):
    id: Any
    name: str
    institution: InstitutionInfo = None
    last_update: datetime = None
    balances: List[CurrencyAmount] = []
    transactions: List[Transaction] = []
