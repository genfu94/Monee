import configparser
from uuid import uuid4
from nordigen import NordigenClient
from fastapi import FastAPI, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from database_manager import mongo_client, account_db_manager
from datetime import datetime

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

client = None
db_client = None

@app.get("/{country_code}")
async def select_bank(request: Request, country_code: str):
    banks = client.institution.get_institutions(country_code)
    return banks

@app.get("/bank_connect/{institution_id}")
async def bank_connect(institution_id: str):
    init = client.initialize_session(
        # institution id
        institution_id=institution_id,
        # redirect url after successful authentication
        redirect_uri="https://nordigen.com",
        # additional layer of unique ID defined by you
        reference_id=str(uuid4())
    )

    print(init.requisition_id)

    return {
        "link": init.link,
        "requisition_id": init.requisition_id
    }


@app.get("/accounts/{requisition_id}")
async def get_account_list(requisition_id: str):
    # Get account id after you have completed authorization with a bank
    # requisition_id can be gathered from initialize_session response
    accounts = client.requisition.get_requisition_by_id(
        requisition_id=requisition_id
    )

    print(accounts)

    return None



@app.get("/account/fetch_accounts")
async def fetch_account_info(username: str):
    db_ref = mongo_client["budget_app"]
    subaccount_collection = db_ref["sub_accounts"]

    user_accounts = account_db_manager.find_accounts_by_username(username)

    for acc in user_accounts:
        sub_accounts = client.requisition.get_requisition_by_id(
            requisition_id=acc['requisition_id']
        )

        for i, sub_acc_id in enumerate(sub_accounts['accounts']):
            sub_acc_instance = client.account_api(id=sub_acc_id)
            sub_acc_details = sub_acc_instance.get_details()['account']
            last_account_update = account_db_manager.get_sub_account_last_update(sub_acc_id)
            balance = sub_acc_instance.get_balances()['balances'][0]['balanceAmount']
            transactions = sub_acc_instance.get_transactions(date_from=last_account_update)['transactions']

            if sub_acc_details['status'] == 'enabled':
                account_db_manager.update_sub_account(sub_acc_id, balance, transactions)
                

    return None


if __name__ == "__main__":
    config = configparser.ConfigParser()
    config.read('config.ini')

    client = NordigenClient(
        secret_id=config['DEFAULT']['NordigenSecretID'],
        secret_key=config['DEFAULT']['NordigenSecretKey']
    )

    client.generate_token()

    uvicorn.run(app, host="0.0.0.0", port=8000)