import React, { useState, useEffect } from "react";
import SideMenuLayout from "./SideMenuLayout.js";
import TransactionListAdapter from "../Components/TransactionList/TransactionListAdapter.js";
import "./style.css";
import dayjs from "dayjs";
import DateRangeSelector from "../Components/DateRangeSelector/DateRangeSelector.js";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const getPreviousMonday = () => {
    const currWeekday = dayjs().day() === 0 ? 6 : dayjs().day() - 1;
    
    return dayjs().subtract(currWeekday, "day")
  }
  
  const getMonthStart = () => {
    let monthStart = dayjs();
    monthStart.set('day', 1);
    return monthStart;
  }
  
  const getYearStart = () => {
    let yearStart = dayjs();
    yearStart.set('month', 1);
    yearStart.set('day', 1)
    return yearStart;
  }

  const DATE_RANGE_PRESETS = [
    {
      presetId: "last_7_days",
      label: "Last 7 days",
      value: [dayjs().subtract(7, "day"), dayjs()],
    },
    {
      presetId: "last_30_days",
      label: "Last 30 days",
      value: [dayjs().subtract(30, "day"), dayjs()]
    },
    {
      presetId: "last_90_days",
      label: "Last 90 days",
      value: [dayjs().subtract(90, "day"), dayjs()]
    },
    {
      presetId: "last_12_months",
      label: "Last 12 months",
      value: [dayjs().subtract(12, "month"), dayjs()]
    },
    {
      presetId: "this_week",
      label: "This week",
      value: [getPreviousMonday(), dayjs()]
    },
    {
      presetId: "this_month",
      label: "This month",
      value: [getMonthStart(), dayjs()]
    },
    {
      presetId: "this_year",
      label: "This year",
      value: [getYearStart(), dayjs()]
    }
  ];

  const [value, setValue] = useState(DATE_RANGE_PRESETS[0].value);
  const [selectedPreset, setSelectedPreset] = useState(
    DATE_RANGE_PRESETS[0].presetId
  );

  const fetchTransactions = (dateFrom, dateTo) => {
    fetch(
      `http://localhost:8000/fetch_transactions?account_id=8b4b8896-bef7-4ce0-b69c-03bba8bf7fc4&date_from=${dateFrom.format(
        "DD-MM-YYYY"
      )}&date_to=${dateTo.format("DD-MM-YYYY")}`
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
    fetchTransactions(dayjs().subtract(30, "day"), dayjs());
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
