import dayjs from "dayjs";
import { getMonthStart } from "./date.js";
import TimeSeries from "../components/TimeSeries/TimeSeries.js";


export function getNetworthSeries(accounts) {
  let dates = [];
  let networth = [];

  for (const account of accounts) {
    for (const transaction of account.transactions) {
      dates.push(dayjs(transaction.booking_date, "YYYY-MM-DD, hh:mm:ss").toDate());
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
      dates.push(dayjs(transaction.booking_date, "YYYY-MM-DD, hh:mm:ss").toDate());
      expenses.push(transaction.transaction_amount.amount);
    }
  }

  return new TimeSeries(dates, expenses);
}

export function networthChange(networthSeries) {
  const currentTotal = networthSeries.loc(-1).data;
  const monthStart = getMonthStart();
  const totalStartPeriod = networthSeries.at(monthStart).data;
  return Math.trunc((currentTotal-totalStartPeriod)/totalStartPeriod * 100);
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