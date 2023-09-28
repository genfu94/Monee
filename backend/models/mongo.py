from typing import Union, List, Optional
from dataclasses import dataclass
from pydantic import BaseModel, validator
from enum import Enum
from datetime import datetime


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
    currency_symbol: str
    amount: float


class Transaction(BaseModel):
    id: str
    account_id: str
    origin: str
    amount: CurrencyAmount
    type: str
    booking_date: datetime
    category: str = None
    category_edited: bool = None
    text: Union[str, None] = None
    account_balance: float = None


class Account(BaseModel):
    id: str
    name: str
    institution: InstitutionInfo = None
    last_update: datetime = None
    balances: List[CurrencyAmount] = []
