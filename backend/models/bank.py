from typing import Optional, List, Any, Dict
from typing_extensions import Annotated, Union
from enum import Enum
import bson.json_util as json_util
from pydantic import (
    BaseModel,
    AfterValidator,
    BeforeValidator,
    PlainSerializer,
    WithJsonSchema,
    Field,
    ConfigDict,
    model_serializer,
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


class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    model_config = ConfigDict(arbitrary_types_allowed=True)

    @model_serializer
    def ser_model(self) -> Dict[str, Any]:
        return {"_id": json_util.dumps(self.id)}


class StringIDMongoBaseModel(BaseModel):
    id: str = Field(alias="_id")
    model_config = ConfigDict(arbitrary_types_allowed=True)

    @model_serializer
    def ser_model(self) -> Dict[str, Any]:
        return {"_id": self.id}


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


class NordigenBankLink(MongoBaseModel):
    client: Optional[str]
    requisition_id: str
    url: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED

    def get_identifiers(self):
        return {"requisition_id": self.requisition_id}


BankLink = NordigenBankLink


class Account(StringIDMongoBaseModel):
    name: str
    last_update: Optional[DateField] = None
    balances: List[Amount] = []


class Bank(MongoBaseModel):
    link: NordigenBankLink
    institution: InstitutionInfo
    accounts: List[Account]


class TransactionAccountInfo(StringIDMongoBaseModel):
    name: str


class Transaction(BaseModel):
    id: str = Field(alias="_id")
    origin: str
    text: Optional[str] = None
    transaction_amount: Amount
    booking_date: Optional[DateField]
    type: str = None
    account: Optional[TransactionAccountInfo] = None


BankList = TypeAdapter(List[Bank])
TransactionList = TypeAdapter(List[Transaction])
