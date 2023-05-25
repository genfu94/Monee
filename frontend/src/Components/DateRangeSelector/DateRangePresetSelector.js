import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";

import { radioStyle } from "./constants";

export default function DateRangePresetSelector({ options, value, onChange }) {
  const renderRadioButtons = () => {
    return (
      <>
        {options.map((item) => (
          <FormControlLabel
            key={item.presetId}
            value={item.presetId}
            control={<Radio sx={radioStyle} />}
            label={<Typography>{item.label}</Typography>}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <RadioGroup
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
        value={value}
        onChange={(_, v) => onChange(v)}
      >
        <Box style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr" }}>
          {renderRadioButtons()}
        </Box>
      </RadioGroup>
    </>
  );
}
