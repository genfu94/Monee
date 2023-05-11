import React from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

import { dateRanges, radioStyle } from "./constants";

export default function ProvidedRangeMenu({value, onChange}) {
  const renderRadioButtons = (start, end = null) => {
    return (
      <>
        {dateRanges.slice(start, end).map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio sx={radioStyle} />}
            label={
              <div style={{ fontFamily: "Montserrat", fontSize: "13px" }}>
                {item.label}
              </div>
            }
          />
        ))}
      </>
    );
  };

  return (
    <>
      <RadioGroup
        defaultValue="last_7_days"
        style={{ display: "flex", flexDirection: "row" }}
        value={value}
        onChange={(_, v) => onChange(v)}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {renderRadioButtons(0, 6)}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {renderRadioButtons(6, 12)}
        </div>
      </RadioGroup>
    </>
  );
}
