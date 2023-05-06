import React, { useState } from "react";
import Button from "@mui/material/Button/Button";
import { GoTriangleDown } from "react-icons/go";

import "./DateRangeSelector.style.css";
import { useInput } from "./hooks";
import DateRangeOptions from "./DateRangeOptions";

export const defaultSx = {
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

function DateRangeSelector() {
  const [open, switchOpen] = useInput();

  return (
    <div>
      <div className="date-range-selector-container">
        <Button variant="outlined" sx={defaultSx.Button} onClick={switchOpen}>
          <GoTriangleDown
            style={{ color: "black", fontSize: "10px", marginLeft: "auto" }}
          />
        </Button>
        {open && <DateRangeOptions/>}
      </div>
    </div>
  );
}

export default DateRangeSelector;
