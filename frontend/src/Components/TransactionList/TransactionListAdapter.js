import dayjs from "dayjs";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import TransactionList from "./TransactionList.js";

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

function TransactionListAdapter({ transactionList, onTransactionEdit }) {
  const transactionsGroupedByDate = groupTransactionsByDate(transactionList);

  return (
    <InfiniteScroll
      dataLength={transactionList.length}
      next={() => console.log("Fetch more data")}
      hasMore={true}
      loader={<p>Loading...</p>}
      endMessage={<p>No more data to load.</p>}
    >
      <TransactionList
        transactionsGroupedByDate={transactionsGroupedByDate}
        onTransactionEdit={onTransactionEdit}
      />
    </InfiniteScroll>
  );
}

export default TransactionListAdapter;
