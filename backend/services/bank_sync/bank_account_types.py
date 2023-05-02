from dataclasses import dataclass, field
from typing import List
from .bank_link_types import BankLinkingDetails
from dataclasses_json import dataclass_json

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

@dataclass_json
@dataclass
class AccountData:
    id: str
    name: str
    last_update: str = None
    bank_linking_details: BankLinkingDetails = None
    balances: List[Balance] = field(default_factory=lambda : [])
    transactions: List[Transaction] = field(default_factory=lambda : [])
