import React from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

import { radioStyle } from "./constants";

export default function DateRangePresetSelector({options, value, onChange}) {
  const renderRadioButtons = () => {
    return (
      <>
        {options.map((item) => (
          <FormControlLabel
            key={item.presetId}
            value={item.presetId}
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
        style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center"}}
        value={value}
        onChange={(_, v) => onChange(v)}
      >
        <div style={{ display: "inline-grid", gridTemplateColumns: '1fr 1fr'}}>
          {renderRadioButtons()}
        </div>
      </RadioGroup>
    </>
  );
}
