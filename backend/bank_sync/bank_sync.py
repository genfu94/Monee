from uuid import uuid4


class BankSync:
    def __init__(self, bank_sync_client):
        self.bank_sync_client = bank_sync_client
    

    def start_bank_syncing(self, institution_id):
        init = self.client.initialize_session(
            # institution id
            institution_id=institution_id,
            # redirect url after successful authentication
            redirect_uri="https://nordigen.com",
            # additional layer of unique ID defined by you
            reference_id=str(uuid4())
        )

        return {
            "link": init.link,
            "requisition_id": init.requisition_id
        }


    def list_accounts(self, requisition_id):
        accounts = self.bank_sync_client.requisition.get_requisition_by_id(
            requisition_id=requisition_id
        )

        return accounts

    def get_sub_account_details(self, sub_account_id):
        sub_acc_instance = self.bank_sync_client.account_api(id=sub_account_id)
        return sub_acc_instance.get_details()['account']

    def get_sub_account_balance(self, sub_account_id):
        sub_acc_instance = self.bank_sync_client.account_api(id=sub_account_id)
        return sub_acc_instance.get_balances()['balances'][0]['balanceAmount']

    def get_sub_account_transactions(self, sub_account_id, last_account_update):
        sub_acc_instance = self.bank_sync_client.account_api(id=sub_account_id)
        return sub_acc_instance.get_transactions(date_from=last_account_update)['transactions']
