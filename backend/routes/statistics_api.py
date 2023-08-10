from fastapi import APIRouter, Depends
from typing import Annotated
import pandas as pd
from dependencies.dependencies import get_bank_sync
from dependencies.authentication import validate_token_and_get_active_user
import numpy as np

pd.set_option("display.max_rows", 500)

router = APIRouter(prefix="/api")


@router.get("/networth_trend")
async def networth_trend(username: Annotated[str, Depends(validate_token_and_get_active_user)]):
    # account_transactions = []
    # for account in get_bank_sync().account_crud.find_by_user(username):
    #     account_dict = account.dict()
    #     account_dict["transactions"] = get_bank_sync().transaction_crud.find_by_account(account.id)
    #     account_dict["transactions"] = [t.dict() for t in account_dict["transactions"]]
    #     account_transactions.append(account_dict)

    # accounts_balance_trend = []
    # min_date = None
    # max_date = None
    # for account in account_transactions:
    #     if len(account["transactions"]) == 0:
    #         continue

    #     curr_df = pd.DataFrame.from_dict(account["transactions"])[["booking_date", "account_balance"]]
    #     curr_df = curr_df.resample("1D", on="booking_date").last().replace(0, np.NAN).fillna(method="ffill")
    #     accounts_balance_trend.append(curr_df)
    #     if min_date == None:
    #         min_date = curr_df.index.min()

    #     if max_date == None:
    #         max_date = curr_df.index.max()

    #     min_date = min(min_date, curr_df.index.min())
    #     max_date = max(max_date, curr_df.index.max())

    # new_index = pd.date_range(start=min_date, end=max_date)
    # accounts_balance_trend = [
    #     df.reindex(new_index).fillna(method="ffill").fillna(method="bfill") for df in accounts_balance_trend
    # ]
    # balance_trend = accounts_balance_trend[0]
    # for bt in accounts_balance_trend[1:]:
    #     balance_trend = balance_trend.add(bt)

    # return balance_trend.reset_index().to_dict("records")
    return []
