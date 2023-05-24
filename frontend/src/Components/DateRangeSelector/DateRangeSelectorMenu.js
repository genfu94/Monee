import React from "react";

import { appendCustomRangePreset } from "./utils";
import DateRangePresetSelector from "./DateRangePresetSelector";
import DateRangePicker from "../DateRangePicker/DateRangePicker";

const DateRangeSelectorMenu = ({
  handleClose,
  onChange,
  presets,
  value,
  preset,
}) => {
  const [dateFrom, dateTo] = value;
  const dateRangePresets = appendCustomRangePreset(presets);

  const onPresetSelection = (v) => {
    if (v !== "custom_range") handleClose();
    onChange(v, dateRangePresets.find((item) => item.presetId === v).value);
  };

  const onDatePick = (dateStart, dateTo) => {
    handleClose();
    onChange("custom_range", [dateStart, dateTo]);
  };

  return (
    <>
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
          options={dateRangePresets}
          value={preset}
          onChange={onPresetSelection}
        />
      </div>
      <DateRangePicker
        data-testid="date-range-picker"
        value={[dateFrom, dateTo]}
        onChange={onDatePick}
        disabled={preset !== "custom_range"}
      />
    </>
  );
};

export default DateRangeSelectorMenu;
