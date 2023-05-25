import React from "react";
import { Box, Typography } from "@mui/material";

function LabeledInput(props) {
  const labelStyle = {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "rgb(50, 50, 50)",
    margin: "0.5rem 0px 0.5rem 0px"
  };

  return (
    <Box {...props}>
      <Typography style={labelStyle}>{props.label}</Typography>
      {props.children}
    </Box>
  );
}

export default LabeledInput;