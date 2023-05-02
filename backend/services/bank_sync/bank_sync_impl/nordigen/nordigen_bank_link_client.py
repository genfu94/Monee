from uuid import uuid4
from typing import List
from ...bank_sync import BankLinkClient
from ...data_types import InstitutionInfo, BankLinkingDetailsBase, NordigenBankLinkingDetails, AccountStatus
from ...database_client import AccountDatabaseClient


class NordigenBankLinkClient(BankLinkClient):
    def __init__(self, nordigen_client, account_db_client: AccountDatabaseClient):
        self.nordigen_link_status_map = {
            "CR": AccountStatus.AUTHORIZATION_REQUIRED,
            "GC": AccountStatus.AUTHORIZATION_REQUIRED,
            "UA": AccountStatus.AUTHORIZATION_REQUIRED,
            "RJ": AccountStatus.AUTHORIZATION_REQUIRED,
            "SA": AccountStatus.AUTHORIZATION_REQUIRED,
            "GA": AccountStatus.AUTHORIZATION_REQUIRED,
            "LN": AccountStatus.LINKED,
            "SU": AccountStatus.LINK_EXPIRED,
            "EX": AccountStatus.LINK_EXPIRED
        }

        self.nordigen_client = nordigen_client
        self.account_db_client = account_db_client
      
    def get_available_institutions(self, country_code: str) -> List[InstitutionInfo]:
      raw_institutions = self.nordigen_client.institution.get_institutions(country_code)
      institution_list = [InstitutionInfo(name=r['name'], id=r['id']) for r in raw_institutions]

      return institution_list
    
    def link_bank(self, username: str, institution: InstitutionInfo) -> BankLinkingDetailsBase:
        init = self.nordigen_client.initialize_session(
            institution_id=institution.id,
            redirect_uri="http://localhost:3000",
            reference_id=str(uuid4())
        )

        bank_linking_details = NordigenBankLinkingDetails(
            client="Nordigen",
            link=init.link,
            requisition_id=init.requisition_id,
            institution=institution
        )

        self.account_db_client.add_bank(username, bank_linking_details)
        
        return bank_linking_details

    def fetch_link_bank_status(self, bank_linking_details: BankLinkingDetailsBase) -> BankLinkingDetailsBase:
        nordigen_bank_link_details_json = self.nordigen_client.requisition.get_requisition_by_id(
            requisition_id=bank_linking_details.requisition_id
        )

        return NordigenBankLinkingDetails(
            client="Nordigen",
            link=nordigen_bank_link_details_json['link'],
            requisition_id=bank_linking_details.requisition_id,
            institution=bank_linking_details.institution,
            status=self.nordigen_link_status_map[nordigen_bank_link_details_json['status']]
        )