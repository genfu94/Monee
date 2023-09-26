from typing import Optional, List, Any
from typing_extensions import Annotated, Union
from enum import Enum
from pydantic import (
    BaseModel,
    AfterValidator,
    BeforeValidator,
    PlainSerializer,
    WithJsonSchema,
    Field,
    ConfigDict,
    TypeAdapter,
)
from datetime import datetime
from dateutil.parser import parse
from bson import ObjectId


def validate_date_field(v: Any) -> datetime:
    if isinstance(v, datetime):
        return v

    try:
        return parse(v)
    except Exception as e:
        raise ValueError("Invalid date", e)


DateField = Annotated[
    Union[str, datetime],
    BeforeValidator(validate_date_field),
    PlainSerializer(lambda x: str(x), return_type=str),
]


def validate_object_id(v: Any) -> ObjectId:
    if not v:
        return None
    if isinstance(v, ObjectId):
        return v
    if ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")


PyObjectId = Annotated[
    Union[str, ObjectId],
    AfterValidator(validate_object_id),
    PlainSerializer(lambda x: str(x), return_type=str),
    WithJsonSchema({"type": "string"}, mode="serialization"),
]


class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


class Amount(BaseModel):
    currency: str
    amount: float


class InstitutionInfo(BaseModel):
    id: str
    name: str
    logo: Optional[str] = None


class NordigenBankLink(BaseModel):
    client: Optional[str]
    requisition_id: str
    url: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED

    def get_identifiers(self):
        return {"requisition_id": self.requisition_id}


BankLink = NordigenBankLink


class TransactionAccountInfo(BaseModel):
    id: str = Field(alias="_id")
    name: str


class Transaction(BaseModel):
    id: str = Field(alias="_id")
    origin: str
    text: Optional[str] = None
    transaction_amount: Amount
    booking_date: Optional[DateField]
    type: str = None
    account: Optional[TransactionAccountInfo] = None
    last_balance: Optional[Amount] = None


class Account(BaseModel):
    id: str = Field(alias="_id")
    name: str
    last_update: Optional[DateField] = None
    balances: List[Amount] = []
    transactions: List[Transaction] = None


class Bank(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    link: NordigenBankLink
    institution: InstitutionInfo
    accounts: List[Account]

    model_config = ConfigDict(arbitrary_types_allowed=True)


BankList = TypeAdapter(List[Bank])
TransactionList = TypeAdapter(List[Transaction])
