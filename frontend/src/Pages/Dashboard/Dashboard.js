import React from "react";
import SideMenuLayout from "../../Components/SideMenuLayout.js";
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Dashboard extends React.Component {
  render() {
    return (
      <SideMenuLayout page="Dashboard"/>
    );
  }
}

export default Dashboard;
