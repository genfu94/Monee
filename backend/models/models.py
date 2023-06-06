from pydantic import BaseModel
from services.bank_connect.types import Account, Transaction
from typing import List

class AccountTransactions(Account):
    transactions: List[Transaction]