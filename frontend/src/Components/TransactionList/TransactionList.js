import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import TransactionItem from "./TransactionItem/TransactionItem.js";
import TransactionForm from "../TransactionForm/TransactionForm.js";
import { Tree } from "../NestedSelector/Tree";
import { category_tree } from "../categories";
import { modalStyle, listSubheaderStyle } from "./TransactionList.style.js";

function TransactionList({ transactions }) {
  const [transactionSelected, setTransactionSelected] = useState(null);
  const tree = new Tree(category_tree);

  return (
    <>
      <List disablePadding>
        {Object.keys(transactions).map((sectionId) => (
          <li key={`section-${sectionId}`}>
            <ul>
              <ListSubheader disableGutters style={listSubheaderStyle}>
                {sectionId}
              </ListSubheader>
              
              {transactions[sectionId].map((item) => {
                return (
                  <ListItem key={item.transaction_id}>
                    <TransactionItem
                      tree={tree}
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
          <TransactionForm transaction={transactionSelected} />
        </Box>
      </Modal>
    </>
  );
}

export default TransactionList;
