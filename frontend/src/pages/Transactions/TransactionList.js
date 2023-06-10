import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { groupTransactionsByDate } from "../../utils/statistics.js";

import TransactionItem from "./TransactionItem.js";
import TransactionForm from "../../components/TransactionForm/TransactionForm.js";
import { modalStyle, listSubheaderStyle } from "./TransactionList.style.js";

function TransactionList({
  accounts,
  accountFilter = [],
  dateRange,
  onTransactionEdit,
}) {
  const [transactionSelected, setTransactionSelected] = useState(null);
  const transactionsGroupedByDate = groupTransactionsByDate(
    accounts,
    accountFilter,
    dateRange
  );
  return (
    <>
      <List style={{ alignSelf: "stretch", background: "white" }} disablePadding>
        {Object.keys(transactionsGroupedByDate).map((sectionId) => (
          <li key={sectionId}>
            <ul>
              <ListSubheader style={listSubheaderStyle}>
                {sectionId}
              </ListSubheader>

              {transactionsGroupedByDate[sectionId].map((item) => {
                return (
                  <ListItem key={item.transaction_id} disablePadding>
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
            onChange={(t) => {
              setTransactionSelected(null);
              onTransactionEdit(t);
            }}
            transaction={transactionSelected}
          />
        </Box>
      </Modal>
    </>
  );
}

export default TransactionList;
