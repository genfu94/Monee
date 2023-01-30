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

'''


# Initialize bank session
init = client.initialize_session(
    # institution id
    institution_id='HYPE_HYEEIT22',
    # redirect url after successful authentication
    redirect_uri="https://nordigen.com",
    # additional layer of unique ID defined by you
    reference_id=str(uuid4())
)

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