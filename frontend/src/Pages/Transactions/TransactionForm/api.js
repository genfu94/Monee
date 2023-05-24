import { POST_request } from "../../../Utils/network";
import urlJoin from "url-join";

export function update_transaction(transaction) {
  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "update_transaction"
  );
  const params = {
    account_id: transaction.account_id,
  };
  POST_request(endpoint, params, transaction)
    .then((data) => {
      console.log("Transaction updated");
    });
}
