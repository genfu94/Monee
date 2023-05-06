import React from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "./DateRangeSelector.style.css";

function DateRangeOptions() {
  const dateRanges = [
    {
      value: "last_7_days",
      label: "Last 7 days",
    },
    {
      value: "last_30_days",
      label: "Last 30 days",
    },
    {
      value: "last_90_days",
      label: "Last 90 days",
    },
    {
      value: "last_12_months",
      label: "Last 12 months",
    },
    {
      value: "all",
      label: "All",
    },
    {
      value: "custom_range",
      label: "Custom Range",
    },
    {
      value: "today",
      label: "Today",
    },
    {
      value: "this_week",
      label: "This week",
    },
    {
      value: "this_month",
      label: "This month",
    },
    {
      value: "this_year",
      label: "This year",
    },
  ];

  const radioStyle = {
    padding: "0px 5px 0px 0px",
    "& svg": {
      width: "13px",
      height: "13px",
      opacity: "0.6",
    },
  };

  const datePickerStyle = {
    "& .MuiOutlinedInput-input": {
      fontSize: 14
    }
  }

  return (
    <div className="date-range-selector-options">
      <div style={{fontFamily: "Montserrat", color: "#222", fontWeight: "700", marginBottom: "10px"}}>Choose period</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="last_7_days"
          name="radio-buttons-group"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {dateRanges.slice(0, 6).map((item) => (
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
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {dateRanges.slice(6).map((item) => (
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
          </div>
        </RadioGroup>
      </div>
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker slotProps={{ textField: { size: 'small'}}} sx={datePickerStyle} size="small" defaultValue={dayjs('2022-04-17')} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker slotProps={{ textField: { size: 'small' } }} sx={datePickerStyle} size="small" />
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default DateRangeOptions;
