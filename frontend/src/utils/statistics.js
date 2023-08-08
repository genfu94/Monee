import dayjs from "dayjs";

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
