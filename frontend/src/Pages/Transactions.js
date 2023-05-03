import React, { useState, useEffect } from "react";
import SideMenuLayout from "./SideMenuLayout.js";
import TransactionListAdapter from "../Components/TransactionList/TransactionListAdapter.js";
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
        for (const account of data) {
          new_transactions = [...new_transactions, ...account.transactions];
        }

        setTransactions([...transactions, ...new_transactions]);
        setStartItemIdx(startItemIdx + new_transactions.length);
        setHasMore(new_transactions.length === nItems);
      });
  };

  const onTransactionEdit = (editedTransaction) => {
    let newTransactions = [...transactions];
    for(let i = 0; i < newTransactions.length; i++) {
      if(newTransactions[i].transaction_id === editedTransaction.transaction_id) {
        newTransactions[i] = editedTransaction;
      }
    }

    setTransactions(newTransactions);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <SideMenuLayout
      sideMenuTitle="Transactions"
      content={
        <TransactionListAdapter
          transactionList={transactions}
          onTransactionEdit={onTransactionEdit}
        />
      }
    />
  );
}

export default Transactions;
