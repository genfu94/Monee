from fastapi import APIRouter
from services.banksync.types import InstitutionInfo, Transaction, Account, BankLink
from dependencies import get_bank_sync_client, get_account_db_client
from datetime import datetime
from dateutil.relativedelta import relativedelta

router = APIRouter()

def get_last_sync_time(last_update):
        return datetime.now().replace(hour=(int(last_update.hour / 8)) * 8, minute=0, second=0)


def fetch_account_updates(account_id: str, link: BankLink) -> Account:
    account = get_account_db_client().find_account(account_id)

    if not account:
        account = get_bank_sync_client().bank_account_client.fetch_account(account_id)
        if not account:
            return None
        
        account.bank_linking_details = link

    last_update = datetime.strptime(
        account.last_update, "%Y-%m-%d, %H:%M:%S") if account.last_update else datetime.now() - relativedelta(years=1)
    
    last_sync_time = get_last_sync_time(last_update)

    if last_update < last_sync_time:
        old_transactions_ids = [t['transaction_id'] for t in account.transactions]
        new_transactions = get_bank_sync_client().bank_account_client.fetch_transactions(account, last_update.strftime('%Y-%m-%d'))
        account.transactions = list(filter(lambda x: x['transaction_id'] not in old_transactions_ids, new_transactions))
        account.last_update = datetime.now().strftime("%Y-%m-%d, %H:%M:%S")

    return account


def synchronize_user_accounts(username: str):
    user_bank_links = get_account_db_client().fetch_user_bank_links(username)
    for link in user_bank_links:
        for account_id in get_bank_sync_client().bank_link_client.fetch_account_ids_from_bank_link(link):
            account = fetch_account_updates(account_id, link)
            if account:
                get_account_db_client().add_account(account)


def update_bank_links_statuses(username: str):
    for bank_link_status in get_account_db_client().fetch_user_bank_links(username):
        bank_linking_details = get_bank_sync_client().bank_link_client.fetch_link_bank_status(bank_link_status)
        get_account_db_client().update_bank_link_status(bank_linking_details)

    get_account_db_client().remove_unauthorized_bank_links(username)


@router.get("/get_available_institutions")
async def get_available_institutions(country_code: str):
    return get_bank_sync_client().bank_link_client.get_available_institutions(country_code)


@router.post("/bank_connect")
async def bank_connect(username: str, institution: InstitutionInfo):
    return get_bank_sync_client().bank_link_client.link_bank(username, institution)


@router.get("/synchronize_account")
async def synchronize_account(username: str):
    if get_bank_sync_client().nordigen_client:
        update_bank_links_statuses(username)
        synchronize_user_accounts(username)

    return get_account_db_client().fetch_linked_accounts(username)
