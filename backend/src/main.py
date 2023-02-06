import configparser
from uuid import uuid4
from nordigen import NordigenClient
from fastapi import FastAPI, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/account/fetch_info")
async def fetch_account_info(requisition_id: str, account_id: str):
    accounts = client.requisition.get_requisition_by_id(
        requisition_id=requisition_id
    )

    # Get account id from the list.
    account_id = accounts["accounts"][0]

    # Create account instance and provide your account id from previous step
    account = client.account_api(id=account_id)

    # Fetch account metadata
    meta_data = account.get_metadata()
    # Fetch details
    details = account.get_details()
    # Fetch balances
    balances = account.get_balances()
    # Fetch transactions
    transactions = account.get_transactions()

    print(balances)
    print(transactions)

    return None
'''
print(init)

# Get requisition_id and link to initiate authorization process with a bank
link = init.link # bank authorization link
requisition_id = init.requisition_id

accounts = client.requisition.get_requisition_by_id(
    requisition_id=init.requisition_id
)

# Get account id from the list.
account_id = accounts["accounts"][0]

# Create account instance and provide your account id from previous step
account = client.account_api(id=account_id)
'''

if __name__ == "__main__":
    config = configparser.ConfigParser()
    config.read('config.ini')

    client = NordigenClient(
        secret_id=config['DEFAULT']['NordigenSecretID'],
        secret_key=config['DEFAULT']['NordigenSecretKey']
    )

    client.generate_token()
    uvicorn.run(app, host="0.0.0.0", port=8000)