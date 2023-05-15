import React, { useState } from "react";

import { dropdownStyle } from "./constants";
import dayjs from "dayjs";
import DropDownBase from "../DropDownBase/DropDownBase";
import DateRangePresetSelector from "./ProvidedRangeMenu";
import DateRangePicker from "./DateRangePicker";

function DateRangeSelector({ preset, value, onChange, presets }) {
  let date_range_presets = [...presets];
  date_range_presets.push({
    presetId: "custom_range",
    label: "Custom range",
    value: [dayjs().subtract(30, "day"), dayjs()],
  });

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [dateFrom, dateTo] = value;

  const onPresetSelection = (v) => {
    onChange(v, date_range_presets.find(item => item.presetId === v).value);
  }
  const onDatePick = (dateStart, dateTo) => onChange("custom_range", [dateStart, dateTo]);

  const renderValue = () => {
    if (preset !== "custom_range") {
      return date_range_presets.find((item) => item.presetId === preset).label;
    }

    return `${dateFrom.format("DD-MM-YYYY")} - ${dateTo.format("DD-MM-YYYY")}`;
  };

  return (
    <DropDownBase
      sx={dropdownStyle}
      open={open}
      value={value}
      onOpen={setOpen}
      onClose={handleClose}
      renderValue={renderValue}
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
