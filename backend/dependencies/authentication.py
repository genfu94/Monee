import jwt
from typing import Annotated, Union
from fastapi import status, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from passlib.context import CryptContext
from .dependencies import get_mongo_client

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def validate_token_and_get_active_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.exceptions.InvalidTokenError as e:
        raise credentials_exception

    return payload["sub"]


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def register_user(username: str, password: str):
    global mongo_client
    users_collection = mongo_client["users"]
    U = list(users_collection.find({"username": username}))
    if len(U) != 0:
        raise Exception("Username already exists")

    print("I'm here")
    users_collection.insert_one({"username": username, "hashed_password": pwd_context.hash(password)})


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(username: str):
    user_collection = get_mongo_client()["users"]
    return user_collection.find_one({"username": username})


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False

    return user
