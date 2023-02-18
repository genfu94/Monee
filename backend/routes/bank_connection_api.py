from fastapi import APIRouter
from bank_sync.bank_sync import bank_sync_client, InstitutionInfo

router = APIRouter()

@router.post("/bank_connect")
async def bank_connect(username:str, institution: InstitutionInfo):
    global bank_sync_client
    return bank_sync_client.link_bank(username, institution)