import React, {useState, useEffect} from "react";
import SideMenuLayout from "./SideMenuLayout.js";
import TransactionList from "../Components/TransactionList/TransactionList.js";
import "./style.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [startItemIdx, setStartItemIdx] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const nItems = 30;


  const fetchTransactions = () => {
    fetch(
      `http://localhost:8000/fetch_linked_accounts?username=user&start_item_idx=${startItemIdx}&n_items=${nItems}`
    )
      .then((res) => res.json())
      .then((data) => {
        let new_transactions = [];
        console.log("Accounts", data)
        for (const account of data) {
          new_transactions = [...new_transactions, ...account.transactions];
        }

        setTransactions([...transactions, ...new_transactions]);
        setStartItemIdx(startItemIdx + new_transactions.length);
        setHasMore(new_transactions.length === nItems);
      });
  }
  
  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <>
      <SideMenuLayout
        sideMenuTitle="Transactions"
        content={
          <TransactionList
            transactions={transactions}
            fetchData={fetchTransactions}
            hasMore={hasMore}
          />
        }
      />
    </>
  );
}

export default Transactions;
