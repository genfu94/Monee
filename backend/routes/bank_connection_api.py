from fastapi import APIRouter
from bank_sync.bank_sync import InstitutionInfo
from dependencies import get_bank_sync_client

router = APIRouter()

@router.post("/bank_connect")
async def bank_connect(username:str, institution: InstitutionInfo):
    return get_bank_sync_client().link_bank(username, institution)


@router.get("/update_bank_links")
async def update_bank_links(username:str):
    return get_bank_sync_client().update_bank_links_statuses(username)