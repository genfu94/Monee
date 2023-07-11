from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dependencies import initialize_bank_sync_client
from time import sleep
from config import fetch_config

import routes.bank_connection_api

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(routes.bank_connection_api.router)


@app.on_event("startup")
def startup_event():
    fetch_config()
    
    # TODO: use a more robust way to handle waiting for keycloak initialization
    sleep(50)
    initialize_bank_sync_client()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)