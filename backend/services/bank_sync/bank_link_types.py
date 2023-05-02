from pydantic import BaseModel
from enum import Enum
from typing import Union
from abc import ABC, abstractmethod
from dataclasses import dataclass


class AccountStatus(int, Enum):
    AUTHORIZATION_REQUIRED = 0
    LINKED = 1
    LINK_EXPIRED = 2


@dataclass
class APICredentials:
    secret_id: str
    secret_key: str


class InstitutionInfo(BaseModel):
    name: str
    id: str


class BankLinkingDetailsBase(BaseModel, ABC):
    client: str

    @abstractmethod
    def get_identifiers(self):
        pass


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
