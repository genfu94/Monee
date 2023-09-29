import jwt
from typing import Union
from datetime import datetime, timedelta
from passlib.context import CryptContext

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


class AuthenticationEngine:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)

    def create_access_token(
        self, data: dict, expires_delta: Union[timedelta, None] = None
    ):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def validate_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except jwt.exceptions.InvalidTokenError as e:
            raise Exception("Token is not valid")

        return payload


class MongoAuthenticationEngine(AuthenticationEngine):
    def __init__(self, mongo_client):
        super(MongoAuthenticationEngine, self).__init__()
        self.mongo_client = mongo_client
        self.users_collection = self.mongo_client["users"]

    def _get_user(self, username: str):
        return self.users_collection.find_one({"username": username})

    def register_user(self, username: str, password: str):
        if self._get_user(username):
            raise Exception("Username already exists")

        self.users_collection.insert_one(
            {"username": username, "hashed_password": self.pwd_context.hash(password)}
        )

    def authenticate_user(self, username: str, password: str):
        user = self._get_user(username)
        if not user:
            return False

        if not self.verify_password(password, user["hashed_password"]):
            return False

        return user
