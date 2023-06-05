from fastapi import APIRouter
from services.banksync.types import InstitutionInfo, Account, BankLink
from models.models import AccountTransactions
from dependencies import get_bank_sync_client, get_account_crud, get_bank_link_crud, get_transaction_crud
from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import List
import json

router = APIRouter()

def get_last_sync_time(last_update):
        return datetime.now().replace(hour=(int(last_update.hour / 8)) * 8, minute=0, second=0)


def fetch_account_updates(account_id: str, link: BankLink) -> Account:
    account = get_account_crud().find_by_id(account_id)

    if not account:
        account = get_bank_sync_client().bank_account_client.fetch_account(account_id)
        account.bank_link = link

    last_update = datetime.strptime(
        account.last_update, "%Y-%m-%d, %H:%M:%S") if account.last_update else datetime.now() - relativedelta(years=1)
    
    last_sync_time = get_last_sync_time(last_update)
    new_transactions = []
    if last_update < last_sync_time:
        old_transactions_ids = get_transaction_crud().find_by_account(account_id)
        new_transactions = get_bank_sync_client().bank_account_client.fetch_transactions(account_id, last_update.strftime('%Y-%m-%d'))
        new_transactions = list(filter(lambda x: x['id'] not in old_transactions_ids, new_transactions))
        account.last_update = datetime.now().strftime("%Y-%m-%d, %H:%M:%S")

    return account, new_transactions


def synchronize_user_accounts(username: str):
    user_bank_links = get_bank_link_crud().find_by_user(username)
    for link in user_bank_links:
        for account_id in get_bank_sync_client().bank_link_client.fetch_account_ids_from_bank_link(link):
            account, transactions = fetch_account_updates(account_id, link)
            get_account_crud().add(username, link, account, upsert=True)
            get_transaction_crud().add(account_id, transactions)


def update_bank_links_statuses(username: str):
    for bank_link_status in get_bank_link_crud().find_by_user(username):
        bank_linking_details = get_bank_sync_client().bank_link_client.fetch_link_bank_status(bank_link_status)
        get_bank_link_crud().update(bank_linking_details)

    get_bank_link_crud().delete_unauthorized_links(username)


@router.get("/get_available_institutions")
async def get_available_institutions(country_code: str):
    return get_bank_sync_client().bank_link_client.get_available_institutions(country_code)


@router.post("/bank_connect")
async def bank_connect(username: str, institution: InstitutionInfo):
    bank_link = get_bank_sync_client().bank_link_client.link_bank(institution)
    get_bank_link_crud().add(username, bank_link)
    return bank_link


@router.get("/synchronize_account")
async def synchronize_account(username: str) -> List[AccountTransactions]:
    if get_bank_sync_client().nordigen_client:
        update_bank_links_statuses(username)
        synchronize_user_accounts(username)

    return [{'account': json.loads(acc.json()), 'transactions': get_transaction_crud().find_by_account(acc.id)} for acc in get_account_crud().find_by_user(username)]
