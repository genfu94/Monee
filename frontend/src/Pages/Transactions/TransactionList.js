import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import dayjs from "dayjs";
import TransactionItem from "./TransactionItem.js";
import TransactionForm from "../../Components/TransactionForm/TransactionForm.js";
import { modalStyle, listSubheaderStyle } from "./TransactionList.style.js";

function groupTransactionsByDate(transactionList) {
  let transactionsGroupedByDate = {};

  for (const transaction of transactionList) {
    const dates = Object.keys(transactionsGroupedByDate);
    const booking_date = dayjs(transaction.booking_date).format("MMM DD, YYYY");

    if (!dates.includes(booking_date)) {
      transactionsGroupedByDate[booking_date] = [];
    }

    transactionsGroupedByDate[booking_date].push(transaction);
  }

  return transactionsGroupedByDate;
}

function TransactionList({ transactions, onTransactionEdit }) {
  const [transactionSelected, setTransactionSelected] = useState(null);
  const transactionsGroupedByDate = groupTransactionsByDate(transactions);
  return (
    <>
      <List style={{alignSelf: "stretch"}} disablePadding>
        {Object.keys(transactionsGroupedByDate).map((sectionId) => (
          <li key={sectionId}>
            <ul>
              <ListSubheader style={listSubheaderStyle}>
                {sectionId}
              </ListSubheader>
              
              {transactionsGroupedByDate[sectionId].map((item) => {
                return (
                  <ListItem key={item.transaction_id}>
                    <TransactionItem
                      transaction={item}
                      onItemClick={() => setTransactionSelected(item)}
                    />
                  </ListItem>
                );
              })}
            </ul>
          </li>
            ))}
      </List>

      <Modal
        disableAutoFocus={true}
        open={transactionSelected != null}
        onClose={() => setTransactionSelected(null)}
      >
        <Box sx={modalStyle}>
          <TransactionForm
            onChange={onTransactionEdit}
            transaction={transactionSelected}
          />
        </Box>
      </Modal>
    </>
  );
}

export default TransactionList;
