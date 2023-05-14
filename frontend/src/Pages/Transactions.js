import React, { useState, useEffect } from "react";
import SideMenuLayout from "./SideMenuLayout.js";
import TransactionListAdapter from "../Components/TransactionList/TransactionListAdapter.js";
import "./style.css";
import dayjs from "dayjs";
import DateRangeSelector from "../Components/DateRangeSelector/DateRangeSelector.js";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = (dateFrom, dateTo) => {
    console.log("Eccomi");
    fetch(
      `http://localhost:8000/fetch_transactions?account_id=8b4b8896-bef7-4ce0-b69c-03bba8bf7fc4&date_from=${dateFrom.format('DD-MM-YYYY')}&date_to=${dateTo.format('DD-MM-YYYY')}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(dateFrom, dateTo)
        setTransactions(data);
      });
  };

  const onTransactionEdit = (editedTransaction) => {
    let newTransactions = [...transactions];
    for (let i = 0; i < newTransactions.length; i++) {
      if (
        newTransactions[i].transaction_id === editedTransaction.transaction_id
      ) {
        newTransactions[i] = editedTransaction;
      }
    }

    setTransactions(newTransactions);
  };

  useEffect(() => {
    fetchTransactions(dayjs(), dayjs().subtract(30, "day"));
  }, []);

  return (
    <SideMenuLayout
      sideMenuTitle="Transactions"
      content={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <DateRangeSelector onChange={dates => {fetchTransactions(dates[0], dates[1])}}/>
          <TransactionListAdapter
            transactionList={transactions}
            onTransactionEdit={onTransactionEdit}
          />
        </div>
      }
    />
  );
}

export default Transactions;
