from pydantic import BaseModel, Field
from typing import List
from .bank_link_types import BankLinkingDetails

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
    bank_linking_details: BankLinkingDetails = None
    balances: List[Balance] = []
    transactions: List[Transaction] = []
