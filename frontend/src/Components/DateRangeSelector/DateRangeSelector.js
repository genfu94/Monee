import React, { useState } from "react";

import Button from "@mui/material/Button/Button";
import { GoTriangleDown } from "react-icons/go";

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
  return (
    <Button variant="outlined" sx={defaultSx.Button}>
      <GoTriangleDown style={{ color: "black", fontSize: '10px', marginLeft: "auto" }} />
    </Button>
  );
}

export default DateRangeSelector;
