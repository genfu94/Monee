from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
from pydantic import BaseModel, validator
from enum import Enum
from typing import List
import json


class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


class BankLinkingDetails(BaseModel):
    client: str

    _subtypes = dict()

    def __init_subclass__(cls, client=None):
        cls._subtypes[client or cls.__name__.lower()] = cls
    
    @classmethod
    def _convert_to_real_type(cls, data):
        client_type = data.get("client")

        if client_type is None:
            raise ValueError("Missing 'client' in BankLinkingDetails")

        sub = cls._subtypes.get(client_type)

        if sub is None:
            raise TypeError(f"Unsupport sub-type: {client_type}")

        return sub(**data)
    
    @classmethod
    def parse_obj(cls, obj):
        return cls._convert_to_real_type(obj)

    @classmethod
    def parse_raw(cls, str_obj):
        return cls._convert_to_real_type(json.loads(str_obj))
    

class InstitutionInfo(BaseModel):
    name: str
    id: str


class NordigenBankLinkingDetails(BankLinkingDetails, client="Nordigen"):
    requisition_id: str
    institution: InstitutionInfo
    link: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED


class Balance(BaseModel):
    currency: str
    amount: float


class Transaction(BaseModel):
    pass


class AccountData(BaseModel):
    account_id: str
    account_name: str
    bank_linking_details: BankLinkingDetails
    balances: List[Balance] = []
    transactions: List[Transaction] = []

    @classmethod
    def parse_raw(cls, str_obj):
        parsed = cls.parse_obj(json.loads(str_obj))
        parsed.bank_linking_details = parsed.bank_linking_details.parse_obj(json.loads(str_obj)['bank_linking_details'])

        return parsed


@dataclass_json
@dataclass
class AccountSyncInfo:
    pass


@dataclass_json
@dataclass
class NordigenAccountSyncInfo(AccountSyncInfo):
    requisition_id: str
    account_id: str


@dataclass
class APICredentials:
    secret_id: str
    secret_key: str
