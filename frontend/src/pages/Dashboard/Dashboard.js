import React, { useEffect, useState } from "react";
import SideMenuLayout from "../SideMenuLayout.js";
import Accounts from "../Accounts/Accounts.js";
import { networthTrend } from "../../apis/AccountApi.js";
import TimeChart from "../../components/Plot/TimeChart.js";
import dayjs from "dayjs";

function Dashboard({ banks }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    networthTrend().then((nw) => {
      const newTrend = [];
      for (const b of nw) {
        newTrend.push({
          x: dayjs(b.index, "YYYY-MM-DDTHH:mm").toDate(),
          y: b.last_balance.amount,
        });
      }
      setData(newTrend);
    });
  }, [banks]);

  const timeChart = new TimeChart();
  timeChart.add(data, "rgba(0, 0, 255, 1.0)", "rgba(0, 0, 255, 0.2)", "€");

  return (
    <SideMenuLayout
      page="Dashboard"
      content={
        <>
          <Accounts banks={banks} />
          {timeChart.plot()}
        </>
      }
    />
  );
}

export default Dashboard;
