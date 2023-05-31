import React from "react";
import SideMenuLayout from "../../Components/SideMenuLayout.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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

function Dashboard({ accounts }) {
  const expenseByCategory = groupExpensesByCategory(accounts);
  const data = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: "Expense by category",
        data: Object.values(expenseByCategory),
        borderWidth: 1,
      },
    ],
  };

  return (
    <SideMenuLayout
      page="Dashboard"
      content={
        <div style={{ width: "10rem", height: "10rem" }}>
          <Doughnut
            data={data}
            options={{
              plugins: {
                legend: false,
              },
            }}
          />
        </div>
      }
    />
  );
}

export default Dashboard;
