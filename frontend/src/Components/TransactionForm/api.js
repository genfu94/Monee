import { POST_request } from "../../Utils/network";
import urlJoin from "url-join";

export function update_transaction(new_transaction, old_transaction) {
  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "update_transaction"
  );
  const params = {
    account_id: old_transaction.account_id,
    category_edited: new_transaction.category !== old_transaction.category
  };
  POST_request(endpoint, params, new_transaction)
    .then((data) => {
      console.log("Transaction updated");
    });
}
