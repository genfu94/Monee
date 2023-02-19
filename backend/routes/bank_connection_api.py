from fastapi import APIRouter
from bank_sync.bank_sync import get_bank_sync_client, InstitutionInfo

router = APIRouter()

@router.post("/bank_connect")
async def bank_connect(username:str, institution: InstitutionInfo):
    return get_bank_sync_client().link_bank(username, institution)