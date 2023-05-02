from enum import Enum
from typing import Union
from abc import ABC, abstractmethod
from dataclasses import dataclass
from dataclasses_json import dataclass_json

class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


@dataclass
class APICredentials:
    secret_id: str
    secret_key: str


@dataclass
class InstitutionInfo:
    name: str
    id: str


@dataclass_json
@dataclass
class BankLinkingDetailsBase(ABC):
    client: str

    @abstractmethod
    def get_identifiers(self):
        pass

@dataclass_json
@dataclass
class NordigenBankLinkingDetails(BankLinkingDetailsBase):
    requisition_id: str
    institution: InstitutionInfo
    link: str
    status: AccountStatus = AccountStatus.AUTHORIZATION_REQUIRED

    def get_identifiers(self):
        return {
            'requisition_id': self.requisition_id
        }


BankLinkingDetails = Union[NordigenBankLinkingDetails, BankLinkingDetailsBase]
