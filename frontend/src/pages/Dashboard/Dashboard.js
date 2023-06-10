import React from "react";
import SideMenuLayout from "../SideMenuLayout.js";

import { Box, Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { getMonthStart } from "../../utils/date.js";
import { getNetworthSeries, getExpensesSeries, networthChange } from "../../utils/statistics.js";
import TimeChart from "../../components/Plot/TimeChart.js";

const BalanceSummaryContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
}));

const BalanceSummaryCard = styled(Card)(({ theme }) => ({
  width: "25%",
  borderRadius: "1rem",
}));

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
  const monthStart = getMonthStart();
  let networthSeries = getNetworthSeries(accounts);
  let expensesSeries = getExpensesSeries(accounts);
  expensesSeries = expensesSeries.filter(monthStart).cumulate();
  networthSeries = networthSeries.resample('1D').min().fillNa();
  const timeChart = new TimeChart();
  timeChart.add(networthSeries.toPlotData(), 'rgba(0, 0, 255, 1.0)', 'rgba(0, 0, 255, 0.2)', '€');
  return (
    <SideMenuLayout
      page="Dashboard"
      content={
        <>
          {renderDashboard(networthSeries, expensesSeries)}
          {timeChart.plot()}
        </>
      }
    />
  );
}

export default Dashboard;
