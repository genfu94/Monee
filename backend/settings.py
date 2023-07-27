from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_DB_CONNECTION_STRING: str
    NORDIGEN_SECRET_ID: str
    NORDIGEN_SECRET_KEY: str