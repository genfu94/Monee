import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import TransactionItem from "./TransactionItem/TransactionItem.js";
import TransactionForm from "../TransactionForm/TransactionForm.js";
import { CATEGORIES_TREE } from "../categories";
import { modalStyle, listSubheaderStyle } from "./TransactionList.style.js";

function TransactionList({ transactionsGroupedByDate, onTransactionEdit }) {
  const [transactionSelected, setTransactionSelected] = useState(null);
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
