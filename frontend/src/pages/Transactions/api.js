import { POST_request } from "../../utils/network";
import urlJoin from "url-join";

export function updateTransaction(transaction) {
  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "update_transaction"
  );
  const params = {
    account_id: transaction.account_id
  };
  POST_request(endpoint, params, transaction)
    .then((data) => {
      console.log("Transaction updated");
    });
}
