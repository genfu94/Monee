from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from services.bank_connect.types import InstitutionInfo
from models.models import AccountTransactions, Token
from dependencies import get_bank_sync, oauth2_scheme, authenticate_user
from typing import List
import jwt

router = APIRouter()

async def validate_token_and_get_active_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # pub_key = get_authentication_public_key()
    # try:
    #     payload = jwt.decode(token, pub_key, algorithms=['RS256'], audience="account")
    # except jwt.exceptions.InvalidTokenError as e:
    #     raise credentials_exception
    
    # if 'preferred_username' not in payload:
    #     raise credentials_exception

    # return payload['preferred_username']
    return 'user'


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": "token", "token_type": "bearer"}

    
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
