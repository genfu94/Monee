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
import InfiniteScroll from 'react-infinite-scroll-component';

function TransactionList({ transactions, fetchData }) {
  const [transactionSelected, setTransactionSelected] = useState(null);
  const tree = new Tree(category_tree);

  const changeTransaction = (newTransaction) => {
    transactionSelected.type = newTransaction.type;
  };

  return (
    <>
      <List disablePadding>
        {/*Object.keys(transactions).map((sectionId) => (
          <li key={sectionId}>
            <ul>
              <ListSubheader style={listSubheaderStyle}>
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
            ))*/}
        <InfiniteScroll
          dataLength={transactions.length}
          next={fetchData}
          hasMore={true} // Replace with a condition based on your data source
          loader={<p>Loading...</p>}
          endMessage={<p>No more data to load.</p>}
        >
          {transactions.map((transaction) => (
            <li>
              <ul>
                <ListItem key={transaction.transaction_id}>
                  <TransactionItem
                    tree={tree}
                    transaction={transaction}
                    onItemClick={() => setTransactionSelected(transaction)}
                  />
                </ListItem>
              </ul>
            </li>
          ))}
        </InfiniteScroll>
      </List>

      <Modal
        disableAutoFocus={true}
        open={transactionSelected != null}
        onClose={() => setTransactionSelected(null)}
      >
        <Box sx={modalStyle}>
          <TransactionForm
            onChange={changeTransaction}
            transaction={transactionSelected}
          />
        </Box>
      </Modal>
    </>
  );
}

export default TransactionList;
