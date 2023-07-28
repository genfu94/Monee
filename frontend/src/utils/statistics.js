import dayjs from "dayjs";
import { getMonthStart } from "./date.js";
import TimeSeries from "../components/TimeSeries/TimeSeries.js";

export function getNetworthSeries(accounts) {
  let dates = [];
  let networth = [];

  for (const account of accounts) {
    for (const transaction of account.transactions) {
      dates.push(
        dayjs(transaction.booking_date, "YYYY-MM-DD, hh:mm:ss").toDate()
      );
      networth.push(transaction.account_balance);
    }
  }
  return new TimeSeries(dates, networth);
}

export function getExpensesSeries(accounts) {
  let dates = [];
  let expenses = [];

  for (const account of accounts) {
    for (const transaction of account.transactions) {
      dates.push(
        dayjs(transaction.booking_date, "YYYY-MM-DD, hh:mm:ss").toDate()
      );
      expenses.push(transaction.transaction_amount.amount);
    }
  }

  return new TimeSeries(dates, expenses);
}

export function networthChange(networthSeries) {
  const currentTotal = networthSeries.loc(-1).data;
  const monthStart = getMonthStart();
  const totalStartPeriod = networthSeries.at(monthStart).data;
  return Math.trunc(
    ((currentTotal - totalStartPeriod) / totalStartPeriod) * 100
  );
}

export function groupExpensesByCategory(accounts) {
  let expenseByCategory = {};
  for (const account of accounts) {
    for (const transaction of account.transactions) {
      if (!Object.keys(expenseByCategory).includes(transaction.category)) {
        expenseByCategory[transaction.category] = 0;
      }

      expenseByCategory[transaction.category] += -parseInt(
        transaction.transaction_amount.amount
      );
    }
  }

  return expenseByCategory;
}

export function groupTransactionsByDate(accounts, accountFilter, dateRange) {
  let transactionsGroupedByDate = {};
  for (const account of accounts) {
    if (!accountFilter.includes(account.id)) continue;

    for (const transaction of account.transactions) {
      const dates = Object.keys(transactionsGroupedByDate);
      const booking_date = dayjs(
        transaction.booking_date,
        "YYYY-MM-DD, hh:mm:ss"
      );

      if (!(booking_date >= dateRange[0] && booking_date <= dateRange[1]))
        continue;

      const format_booking_date = booking_date.format("MMM DD, YYYY");
      if (!dates.includes(format_booking_date)) {
        transactionsGroupedByDate[format_booking_date] = [];
      }

      transactionsGroupedByDate[format_booking_date].push({
        ...transaction,
        account: account.institution_name + " - " + account.name,
      });
    }
  }
  return transactionsGroupedByDate;
}
