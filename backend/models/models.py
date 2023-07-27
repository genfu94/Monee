from pydantic import BaseModel
from services.bank_connect.types import Account, Transaction
from typing import List


class AccountTransactions(Account):
    transactions: List[Transaction]


class Token(BaseModel):
    access_token: str
    token_type: str
