import React, { useState } from "react";

import { dropdownStyle } from "./constants";
import { appendCustomRangePreset, renderValue } from "./utils";
import DropDownBase from "../DropDownBase/DropDownBase";
import DateRangePresetSelector from "./ProvidedRangeMenu";
import DateRangePicker from "../DateRangePicker/DateRangePicker";

function DateRangeSelector({ preset, value, onChange, presets }) {
  const [dateFrom, dateTo] = value;
  const date_range_presets = appendCustomRangePreset(presets);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const onPresetSelection = (v) => {
    if (v !== "custom_range") handleClose();
    onChange(v, date_range_presets.find((item) => item.presetId === v).value);
  };

  const onDatePick = (dateStart, dateTo) => {
    handleClose();
    onChange("custom_range", [dateStart, dateTo]);
  };

  return (
    <DropDownBase
      sx={dropdownStyle}
      open={open}
      value={value}
      onOpen={setOpen}
      onClose={handleClose}
      renderValue={() =>
        renderValue(preset, date_range_presets, dateFrom, dateTo)
      }
    >
      <div
        style={{
          fontFamily: "Montserrat",
          color: "#222",
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
        Choose period
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <DateRangePresetSelector
          options={date_range_presets}
          value={preset}
          onChange={onPresetSelection}
        />
      </div>

      <DateRangePicker
        value={[dateFrom, dateTo]}
        onChange={onDatePick}
        disabled={preset !== "custom_range"}
      />
    </DropDownBase>
  );
}

export default DateRangeSelector;
