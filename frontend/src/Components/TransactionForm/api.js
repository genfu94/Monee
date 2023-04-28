import { POST_request } from "../../Utils/network";


export function update_transaction(transaction) {
  const endpoint = `http://localhost:8000/update_transaction?account_id=${transaction.account_id}`;
  
  POST_request(endpoint, transaction)
    .then((res) => res.json())
    .then((data) => {
      console.log("Transaction updated");
    });
}