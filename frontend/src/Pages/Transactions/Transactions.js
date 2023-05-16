import "../style.css";

import React, { useState, useEffect } from "react";
import SideMenuLayout from "../SideMenuLayout.js";

import {DATE_RANGE_PRESETS} from "../../Utils/date";
import TransactionListAdapter from "../../Components/TransactionList/TransactionListAdapter.js";
import DateRangeSelector from "../../Components/DateRangeSelector/DateRangeSelector.js";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [value, setValue] = useState(DATE_RANGE_PRESETS[0].value);
  const [selectedPreset, setSelectedPreset] = useState(
    DATE_RANGE_PRESETS[0].presetId
  );

  const fetchTransactions = (dateStart, dateEnd) => {
    fetch(
      `http://localhost:8000/fetch_transactions?account_id=8b4b8896-bef7-4ce0-b69c-03bba8bf7fc4&date_from=${dateStart.format(
        "DD-MM-YYYY"
      )}&date_to=${dateEnd.format("DD-MM-YYYY")}`
    )
      .then((res) => res.json())
      .then((data) => {
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
    fetchTransactions(value[0], value[1]);
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
          <DateRangeSelector
            preset={selectedPreset}
            value={value}
            presets={DATE_RANGE_PRESETS}
            onChange={(preset, value) => {
              setValue(value);
              setSelectedPreset(preset);
              fetchTransactions(value[0], value[1])
            }}
          />
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
