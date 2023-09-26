from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta
from models.authentication import Token, UserRegistration
from dependencies.authentication import (
    register_user,
    authenticate_user,
    create_access_token,
    validate_token_and_get_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

router = APIRouter(prefix="/api")


@router.post("/signup")
def signup(new_user: UserRegistration):
    try:
        register_user(new_user.username, new_user.password)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Couldn't perform registration")

    return {"message": "Registration successful"}


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/check_authentication")
async def synchronize_account(username: Annotated[str, Depends(validate_token_and_get_active_user)]) -> dict:
    return {"status": "ok"}
