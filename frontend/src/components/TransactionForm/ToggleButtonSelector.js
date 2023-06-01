import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import {buttonToggleStyle} from "./constants.js";

function ToggleButtonSelector({id, values, labels, value, onChange}) {
  labels = labels === undefined ? values.map((v) => v[0].toUpperCase() + v.substring(1)) : labels;
  
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
          {labels[idx]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default ToggleButtonSelector;