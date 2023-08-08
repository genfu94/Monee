from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dependencies.dependencies import initialize_bank_sync_client

import routes.bank_connection_api
import routes.authentication_api
import routes.statistics_api

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(routes.bank_connection_api.router)
app.include_router(routes.authentication_api.router)
app.include_router(routes.statistics_api.router)


@app.on_event("startup")
def startup_event():
    initialize_bank_sync_client()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
