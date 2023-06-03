from fastapi import APIRouter
from services.banksync.types import InstitutionInfo, Transaction
from dependencies import get_bank_sync_client
from datetime import datetime

router = APIRouter()

# def synchronize_user_accounts(self, username: str):
#     user_bank_links = self.account_db_client.fetch_user_bank_links(
#         username)
#     for link in user_bank_links:
#         for account in self.bank_account_client.fetch_all_bank_accounts(link):
#             account = self.bank_account_client.fetch_account_updates(
#                 account)
#             self.account_db_client.add_account(account)

# def update_bank_links_statuses(self, username: str):
#     for bank_link_status in self.account_db_client.fetch_user_bank_links(username):
#         bank_linking_details = self.bank_link_client.fetch_link_bank_status(
#             bank_link_status)
#         self.account_db_client.update_bank_link_status(
#             bank_linking_details)

#     self.account_db_client.remove_unauthorized_bank_links(username)

@router.get("/get_available_institutions")
async def get_available_institutions(country_code: str):
    return get_bank_sync_client().bank_link_client.get_available_institutions(country_code)


@router.post("/bank_connect")
async def bank_connect(username:str, institution: InstitutionInfo):
    return get_bank_sync_client().bank_link_client.link_bank(username, institution)

@router.get("/networth_trend")
async def networth_trend(username:str):
    return get_bank_sync_client().networth_trend(username)


@router.get("/synchronize_account")
async def synchronize_account(username:str):
    if get_bank_sync_client().nordigen_client:
        get_bank_sync_client().update_bank_links_statuses(username)
        get_bank_sync_client().synchronize_user_accounts(username)
    
    return get_bank_sync_client().account_db_client.fetch_linked_accounts(username)


@router.get("/fetch_linked_accounts")
async def fetch_linked_accounts(username: str):
    return get_bank_sync_client().bank_account_client.fetch_linked_accounts(username)


@router.get("/fetch_transactions")
async def fetch_transactions(account_id: str, date_from: str, date_to: str):
    date_from = datetime.strptime(date_from, "%d-%m-%Y")
    date_to = datetime.strptime(date_to, "%d-%m-%Y")
    return get_bank_sync_client().account_db_client.fetch_transactions(account_id, date_from, date_to)


@router.post("/update_transaction")
async def update_transaction(account_id: str, transaction: Transaction):
    return get_bank_sync_client().account_db_client.update_transaction(account_id, transaction)
