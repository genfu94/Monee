import React from "react";
import SideMenuLayout from "../SideMenuLayout.js";
import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  TimeScale, //Import timescale instead of category for X axis
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { Box, Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import dayjs from "dayjs";
import { getMonthStart } from "../../utils/date.js";
import TimeSeries from "../../components/TimeSeries/TimeSeries.js";

const BalanceSummaryContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
}));

const BalanceSummaryCard = styled(Card)(({ theme }) => ({
  width: "25%",
  borderRadius: "1rem",
}));

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  LineElement,
  TimeScale,
  PointElement,
  Filler
);

function groupExpensesByCategory(accounts) {
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


function getNetworthSeries(accounts) {
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

function getExpensesSeries(accounts) {
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

function networthChange(networthSeries) {
  const currentTotal = networthSeries.loc(-1).data;
  const monthStart = getMonthStart();
  const totalStartPeriod = networthSeries.at(monthStart).data;
  return Math.trunc((currentTotal-totalStartPeriod)/totalStartPeriod * 100);
}

function renderDashboard(networthSeries, expenseSeries) {
  const balanceCards = [
    {
      title: "Total Networth",
      amount: networthSeries.loc(-1).data, //totalNetworth(accounts),
      increasePreviousPeriod: networthChange(networthSeries),
      icon: <FiTrendingUp />,
      background: "green",
    },
    {
      title: "Current Period Expenses",
      amount: expenseSeries.loc(-1).data,
      increasePreviousPeriod: "-10.5",
      icon: <FiTrendingDown />,
      background: "red",
    },
  ];
  return (
    <>
      <BalanceSummaryContainer>
        {balanceCards.map((b) => (
          <BalanceSummaryCard>
            <CardContent>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5">{b.title}</Typography>
                <Box
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    fontSize: "0.9rem",
                    color: "white",
                    padding: "0.3em",
                    borderRadius: "10%",
                    background: b.background,
                  }}
                >
                  {b.icon}
                </Box>
              </Box>
              <Box style={{ display: "flex" }}>
                <Typography
                  variant="h1"
                  sx={{ alignSelf: "end", lineHeight: 1 }}
                >
                  {new Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(b.amount)}
                </Typography>
                <Typography
                  variant="small"
                  sx={{
                    alignSelf: "end",
                    color: "green",
                    fontWeight: 600,
                    marginLeft: "0.5rem",
                  }}
                >
                  {b.increasePreviousPeriod}%
                </Typography>
              </Box>
            </CardContent>
          </BalanceSummaryCard>
        ))}
      </BalanceSummaryContainer>
    </>
  );
}

function Dashboard({ accounts }) {
  const expenseByCategory = groupExpensesByCategory(accounts);
  /*const data = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: "Expense by category",
        data: Object.values(expenseByCategory),
        borderWidth: 1,
      },
    ],
  };*/

  const monthStart = getMonthStart();
  let networthSeries = getNetworthSeries(accounts);
  let expensesSeries = getExpensesSeries(accounts);
  expensesSeries = expensesSeries.filter(monthStart).cumulate();
  networthSeries = networthSeries.resample('1D').min().fillNa();

  const data = {
    datasets: [
      {
        label: "€",
        data: networthSeries.toPlotData(),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.3)",
        fill: true,
        pointRadius: 0,
        hoverPointRadius: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
        },
        type: "time",
        time: {
          unit: "month",
          round: "day",
        },
      },
    },
  };

  // <Doughnut
  //           data={data}
  //           options={{
  //             plugins: {
  //               legend: false,
  //             },
  //           }}
  //         />

  return (
    <SideMenuLayout
      page="Dashboard"
      content={
        <>
          {renderDashboard(networthSeries, expensesSeries)}
          <Line data={data} options={options} />
        </>
      }
    />
  );
}

export default Dashboard;
