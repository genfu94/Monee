import "../style.css";

import React, { useState } from "react";
import {SideMenuLayout, DateRangeSelector} from "../../Components";

import { DATE_RANGE_PRESETS } from "../../Utils/date";
import TransactionList from "./TransactionList.js";


function Transactions({accounts = [], onTransactionEdit = () => {}}) {
  const [value, setValue] = useState(DATE_RANGE_PRESETS[0].value);
  const [selectedPreset, setSelectedPreset] = useState(
    DATE_RANGE_PRESETS[0].presetId
  );

  /*const onTransactionEdit = (editedTransaction) => {
    let newTransactions = [...transactions];
    for (let i = 0; i < newTransactions.length; i++) {
      if (
        newTransactions[i].transaction_id === editedTransaction.transaction_id
      ) {
        newTransactions[i] = editedTransaction;
      }
    }

    setTransactions(newTransactions);
  };*/

  return (
    <SideMenuLayout
      page="Transactions"
      sideMenuTitle="Filters"
      sideMenuContent={
        <></>
      }
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
              //fetchTransactions(value[0], value[1]);
            }}
          />
          <TransactionList
            accounts={accounts}
            onTransactionEdit={onTransactionEdit}
            accountFilter={[]}
          />
        </div>
      }
    />
  );
}

export default Transactions;
