from fastapi import APIRouter
from bank_sync.bank_sync import InstitutionInfo, BankLinkingDetails, NordigenBankLinkingDetails
from dependencies import get_bank_sync_client
import json
from typing import Dict

router = APIRouter()

@router.post("/bank_connect")
async def bank_connect(username:str, institution: InstitutionInfo):
    return get_bank_sync_client().link_bank(username, institution)


@router.get("/update_bank_links")
async def update_bank_links(username:str):
    return get_bank_sync_client().update_bank_links_statuses(username)


@router.get("/fetch_all_bank_accounts")
async def fetch_all_bank_accounts(bank_linking_details: Dict):
    bank_linking_details = BankLinkingDetails.parse_obj(bank_linking_details)
    return get_bank_sync_client().fetch_all_bank_accounts(bank_linking_details)