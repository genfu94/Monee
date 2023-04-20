import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import {buttonToggleStyle} from "./constants.js";

function ToggleButtonSelector({id, values, labels, value, onChange}) {
  return (
    <ToggleButtonGroup
      id={id}
      value={value}
      onChange={(e, v) => onChange(v)}
      exclusive
      style={{ display: "block" }}
    >
      {values.map((item, idx) => (
        <ToggleButton
          key={item}
          sx={buttonToggleStyle}
          value={item}
        >
          {labels[idx][0].toUpperCase() + labels[idx].substring(1)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default ToggleButtonSelector;