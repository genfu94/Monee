from fastapi import APIRouter
from services.bank_connect.types import InstitutionInfo
from models.models import AccountTransactions
from dependencies import get_bank_connector, get_account_crud, get_bank_link_crud, get_transaction_crud, get_bank_sync
from typing import List
import json

router = APIRouter()


@router.get("/get_available_institutions")
async def get_available_institutions(country_code: str):
    return get_bank_connector().bank_link_api.get_available_institutions(country_code)


@router.post("/bank_connect")
async def bank_connect(username: str, institution: InstitutionInfo):
    bank_link = get_bank_connector().bank_link_api.link_bank(institution)
    get_bank_link_crud().add(username, bank_link)
    return bank_link


@router.get("/synchronize_account")
async def synchronize_account(username: str) -> List[AccountTransactions]:
    if get_bank_connector().nordigen_client:
        get_bank_sync().update_bank_links(username)
        get_bank_sync().synchronize_user_accounts(username)

    return [{'account': json.loads(acc.json()), 'transactions': get_transaction_crud().find_by_account(acc.id)} for acc in get_account_crud().find_by_user(username)]
