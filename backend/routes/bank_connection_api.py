from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from services.bank_connect.types import InstitutionInfo
from models.models import AccountTransactions
from dependencies import get_bank_sync, get_authentication_public_key
from typing import List
import jwt

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def validate_token_and_get_active_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    pub_key = get_authentication_public_key()
    try:
        payload = jwt.decode(token, pub_key, algorithms=['RS256'], audience="account")
    except jwt.exceptions.InvalidTokenError as e:
        raise credentials_exception
    
    if 'preferred_username' not in payload:
        raise credentials_exception

    return payload['preferred_username']

    
@router.get("/get_available_institutions")
async def get_available_institutions(country_code: str):
    return get_bank_sync().bank_connector.bank_link_api.get_available_institutions(country_code)


@router.post("/bank_connect")
async def bank_connect(institution: InstitutionInfo, username: Annotated[str, Depends(validate_token_and_get_active_user)]):
    bank_link = get_bank_sync().bank_connector.bank_link_api.link_bank(institution)
    get_bank_sync().bank_link_crud.add(username, bank_link)
    return bank_link


@router.get("/synchronize_account")
async def synchronize_account(username: Annotated[str, Depends(validate_token_and_get_active_user)]) -> List[AccountTransactions]:
    if get_bank_sync().bank_connector.nordigen_client:
        get_bank_sync().update_bank_links(username)
        get_bank_sync().synchronize_user_accounts(username)

    account_transactions = []
    for account in get_bank_sync().account_crud.find_by_user(username):
        account_dict = account.dict()
        account_dict['transactions'] = get_bank_sync().transaction_crud.find_by_account(account.id)
        account_transactions.append(account_dict)

    return account_transactions
