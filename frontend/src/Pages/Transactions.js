import React, {useState, useEffect} from "react";
import SideMenuLayout from "./SideMenuLayout.js";
import TransactionList from "../Components/TransactionList/TransactionList.js";
import "./style.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [item, setItem] = useState(0);

  const fetchTransactions = () => {
    fetch(
      `http://localhost:8000/fetch_linked_accounts?username=user&item=${item}`
    )
      .then((res) => res.json())
      .then((data) => {
        let new_transactions = [];
        for (const account of data) {
          new_transactions = [...new_transactions, ...account.transactions];
        }

        setTransactions([...transactions, ...new_transactions]);
        setItem(item + new_transactions.length);
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
          />
        }
      />
    </>
  );
}

export default Transactions;
