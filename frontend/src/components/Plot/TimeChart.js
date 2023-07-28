import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";

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

class TimeChart extends React.Component {
  constructor() {
    super();

    this.lines = {
      datasets: [],
    };

    this.options = {
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
  }

  add(data, color, areaColor, label, pointRadius = 1, hoverPointRadius = 1) {
    this.lines.datasets.push({
      label: label,
      data: data,
      borderColor: color,
      backgroundColor: areaColor,
      fill: areaColor ? true : false,
      pointRadius: pointRadius,
      hoverPointRadius: 1,
    });
  }

  plot() {
    console.log(this.lines);
    return <Line data={this.lines} options={this.options} />;
  }
}

export default TimeChart;
