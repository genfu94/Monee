from datetime import datetime


class AccountManagerMongo:
    def __init__(self, db_client):
        self.db_client = db_client
        self.account_collection = db_client['budget_app']['accounts']
        self.sub_account_collection = db_client['budget_app']['sub_accounts']
    
    def find_accounts_by_username(self, username: str):
        return self.account_collection.find({'username': username})

    def get_sub_account_last_update(self, sub_account_id: str):
        find_result = self.sub_account_collection.find_one({"_id": sub_account_id}, ["last_update"])
        if find_result and "last_update" in find_result:
            return find_result["last_update"]

        return None

    def update_sub_account(self, sub_account_id: str, new_balance: dict, transactions: list):
        update_query = [
            {
                "$set": {"balance": new_balance},
            },
            {
                "$set": {"last_update": datetime.now().strftime("%Y-%m-%d")}
            },
            {
                "$set": {
                    "transactions": {
                        "$mergeObjects": [
                            "$transactions",
                            transactions
                        ]
                    }
                }
            }
        ]

        self.sub_account_collection.update_one({"_id": sub_account_id}, update_query, upsert=True)