from fastapi import FastAPI
import uvicorn
import configparser
from fastapi.middleware.cors import CORSMiddleware
from bank_sync.bank_sync import (
    bank_sync_client,
    NordigenBankSyncClient,
    APICredentials,
    MongoAccountDatabaseClient
)

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
    global bank_sync_client

    config = configparser.ConfigParser()
    config.read('config.ini')

    account_db_client = MongoAccountDatabaseClient(config['DATABASE']['DBConnectionString'])
    bank_sync_client = NordigenBankSyncClient(
        APICredentials(config['DEFAULT']['NordigenSecretID'], config['DEFAULT']['NordigenSecretKey']),
        account_db_client
    )

    bank_sync_client.initialize()


'''@app.get("/{country_code}")
async def select_bank(request: Request, country_code: str):
    banks = client.institution.get_institutions(country_code)
    return banks


@app.get("/accounts/{requisition_id}")
async def get_account_list(requisition_id: str):
    return bank_sync_client.list_accounts(requisition_id)


@app.get("/account/fetch_accounts")
async def fetch_account_info(username: str):
    user_accounts = account_db_manager.find_accounts_by_username(username)

    for acc in user_accounts:
        sub_accounts = bank_sync_client.list_accounts(acc['requisition_id'])

        for i, sub_acc_id in enumerate(sub_accounts['accounts']):
            last_account_update = account_db_manager.get_sub_account_last_update(sub_acc_id)

            if last_account_update:
                date_time_obj = datetime.strptime(last_account_update, '%Y-%m-%d').date()

                if date_time_obj < datetime.now().date():
                    details = bank_sync_client.get_sub_account_details(sub_acc_id)         
                    balance = bank_sync_client.get_sub_account_balance(sub_acc_id)
                    transactions = bank_sync_client.get_sub_account_transactions(sub_acc_id, last_account_update)

                    if details['status'] == 'enabled':
                        account_db_manager.update_sub_account(sub_acc_id, balance, transactions)
                

    return None'''



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)