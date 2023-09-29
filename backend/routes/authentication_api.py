from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from schemas import Token, UserRegistration
from dependencies.dependencies import get_authentication_engine
from fastapi.security import OAuth2PasswordBearer


router = APIRouter(prefix="/api")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def validate_token_and_get_active_user(
    token: Annotated[str, Depends(oauth2_scheme)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = get_authentication_engine().validate_token(token)
    except:
        raise credentials_exception

    return payload["sub"]


@router.post("/signup")
def signup(new_user: UserRegistration):
    try:
        get_authentication_engine().register_user(new_user.username, new_user.password)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Couldn't perform registration")

    return {"message": "Registration successful"}


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = get_authentication_engine().authenticate_user(
        form_data.username, form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = get_authentication_engine().create_access_token(
        data={"sub": user["username"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/check_authentication")
async def synchronize_account(
    username: Annotated[str, Depends(validate_token_and_get_active_user)]
) -> dict:
    return {"status": "ok"}
