import "../style.css";

import React, { useState, useEffect } from "react";
import SideMenuLayout from "../../Components/SideMenuLayout.js";

import urlJoin from "url-join";
import { GET_request } from "../../Utils/network";
import { DATE_RANGE_PRESETS } from "../../Utils/date";
import TransactionList from "./TransactionList.js";
import DateRangeSelector from "../../Components/DateRangeSelector/DateRangeSelector.js";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { AiFillEye } from "react-icons/ai";

function Transactions({transactions = [], onTransactionEdit = () => {}}) {
  //const [transactions, setTransactions] = useState([]);
  const accountList = [];
  const [value, setValue] = useState(DATE_RANGE_PRESETS[0].value);
  const [selectedPreset, setSelectedPreset] = useState(
    DATE_RANGE_PRESETS[0].presetId
  );

  /*const accounts = [
    {
      name: "N26 - Conto Corrente Principale",
      id: "8b4b8896-bef7-4ce0-b69c-03bba8bf7fc4",
    },
  ];

  const fetchTransactions = (dateStart, dateEnd) => {
    const endpoint = urlJoin(
      process.env.REACT_APP_BACKEND_ENDPOINT,
      "fetch_transactions"
    );
    const params = {
      account_id: "8b4b8896-bef7-4ce0-b69c-03bba8bf7fc4",
      date_from: dateStart.format("DD-MM-YYYY"),
      date_to: dateEnd.format("DD-MM-YYYY"),
    };

    GET_request(endpoint, params).then((data) => {
      setTransactions(data);
    });
  };*/

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
  };

  useEffect(() => {
    fetchTransactions(value[0], value[1]);
  }, [value]);

  const accountList = [{name:'All Accounts', id:null}, ...accounts];*/

  return (
    <SideMenuLayout
      page="Transactions"
      sideMenuTitle="Filters"
      sideMenuContent={
        <div>
          {accountList.map((item) => (
            <FormControlLabel
              label={<Typography variant="small">{item.name}</Typography>}
              control={
                <Checkbox icon={<AiFillEye />} checkedIcon={<AiFillEye />} />
              }
            />
          ))}
        </div>
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
            transactions={transactions}
            onTransactionEdit={onTransactionEdit}
          />
        </div>
      }
    />
  );
}

export default Transactions;
