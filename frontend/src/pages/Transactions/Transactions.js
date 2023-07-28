import "../style.css";

import React, { useState } from "react";
import { DateRangeSelector, CheckboxGroup } from "../../components";

import SideMenuLayout from "../SideMenuLayout";
import { updateTransaction } from "./api";

import { DATE_RANGE_PRESETS } from "../../utils/date";
import TransactionList from "./TransactionList.js";

function Transactions({ accounts = [] }) {
  const [dateRange, setDateRange] = useState(DATE_RANGE_PRESETS[0].value);
  const [selectedPreset, setSelectedPreset] = useState(
    DATE_RANGE_PRESETS[0].presetId
  );
  const accountCheckboxes = accounts.map((a) => ({
    label: a.institution_name + " - " + a.name,
    value: a.id,
  }));
  const [filter, setFilter] = useState(accountCheckboxes.map((a) => a.value));

  const onTransactionEdit = (editedTransaction) => {
    const acc = accounts.find((a) => a._id === editedTransaction.account_id);
    acc.transactions = acc.transactions.map((t) =>
      t.transaction_id === editedTransaction.transaction_id
        ? editedTransaction
        : t
    );

    updateTransaction(editedTransaction);
  };

  return (
    <SideMenuLayout
      page="Transactions"
      sideMenuTitle="Filters"
      sideMenuContent={
        <CheckboxGroup
          options={accountCheckboxes}
          value={filter}
          onChange={(f) => {
            setFilter(f);
          }}
        />
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
            value={dateRange}
            presets={DATE_RANGE_PRESETS}
            onChange={(preset, value) => {
              setDateRange(value);
              setSelectedPreset(preset);
            }}
          />
          <TransactionList
            accounts={accounts}
            onTransactionEdit={onTransactionEdit}
            accountFilter={filter}
            dateRange={dateRange}
          />
        </div>
      }
    />
  );
}

export default Transactions;
