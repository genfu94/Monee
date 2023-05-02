from fastapi import APIRouter
from services.bank_sync.data_types import InstitutionInfo, Transaction
from dependencies import get_bank_sync_client

router = APIRouter()


@router.get("/get_available_institutions")
async def get_available_institutions(country_code: str):
    return get_bank_sync_client().bank_link_client.get_available_institutions(country_code)


@router.post("/bank_connect")
async def bank_connect(username:str, institution: InstitutionInfo):
    return get_bank_sync_client().bank_link_client.link_bank(username, institution)


@router.get("/update_bank_links")
async def update_bank_links(username:str):
    if get_bank_sync_client().nordigen_client:
        get_bank_sync_client().bank_link_client.update_bank_links_statuses(username)
        get_bank_sync_client().bank_account_client.synchronize_user_accounts(username)


@router.get("/fetch_linked_accounts")
async def fetch_linked_accounts(username: str):
    return get_bank_sync_client().bank_account_client.fetch_linked_accounts(username)


@router.post("/update_transaction")
async def update_transaction(account_id: str, transaction: Transaction):
    return get_bank_sync_client().account_db_client.update_transaction(account_id, transaction)
