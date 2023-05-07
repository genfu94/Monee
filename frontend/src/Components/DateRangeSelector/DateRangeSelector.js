import React, { useState } from "react";

import "./DateRangeSelector.style.css";
import DropDownBase from "../DropDownBase/DropDownBase";

export const dropdownStyle = {
  Button: {
    width: "250px",
    height: "40px",
    textTransform: "none",
    backgroundColor: "white",
    "&.MuiButton-outlined": {
      borderColor: "#dadada",
      "&:hover": {
        borderColor: "blue",
        backgroundColor: "white !important",
      },
    },
  },
};

function DropDownMenu({onChange}) {
  return (
    <div onClick={() => onChange("ASD", "ASD")}>ASD</div>
  );
}

function DateRangeSelector() {
  return (
    <DropDownBase sx={dropdownStyle} menu={DropDownMenu}/>
  ) 
}

export default DateRangeSelector;
