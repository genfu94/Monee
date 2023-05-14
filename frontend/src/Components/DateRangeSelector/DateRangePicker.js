import dayjs from "dayjs";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateRangePicker({ value, onChange, disabled = false }) {
  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
      margin: "10px",
      "&.Mui-disabled": {
        border: `1px solid #ddd !important`,
      },
      "&:not(:last-of-type)": {
        border: `1px solid gray`,
        borderRadius: 4,
      },
      "&:not(:first-of-type)": {
        border: `1px solid gray`,
        borderRadius: 4,
      },
    },
  }));

  const toggleButtonStyle = {
    textTrasform: "none",
    width: "45%",
    color: "#333",
    borderColor: "#333",
    "&.Mui-selected": {
      borderColor: "blue !important",
      background: "none",
    },
  };

  const [dateFrom, dateTo] = value;
  const [selectedDate, setSelectedDate] = useState("dateFrom");
  const date = disabled ? null : selectedDate;
  const updateSelectedDate = (_, v) => {
    if (v !== null) setSelectedDate(v);
  };
  const updateDatePicker = (date) => {
    if(selectedDate === "dateFrom") onChange(dayjs(date), dateTo);
    else onChange(dateFrom, dayjs(date));
  };

  return (
    <>
      <StyledToggleButtonGroup
        exclusive
        value={date}
        onChange={updateSelectedDate}
        disabled={disabled}
      >
        <ToggleButton
          sx={toggleButtonStyle}
          value="dateFrom"
          variant="outlined"
        >
          {dateFrom.format("DD-MM-YYYY")}
        </ToggleButton>
        <ToggleButton sx={toggleButtonStyle} value="dateTo" variant="outlined">
          {dateTo.format("DD-MM-YYYY")}
        </ToggleButton>
      </StyledToggleButtonGroup>

      {!disabled && (
        <DatePicker
          selected={
            selectedDate === "dateFrom" ? dateFrom.toDate() : dateTo.toDate()
          }
          minDate={selectedDate === "dateTo" ? dateFrom.toDate() : null}
          maxDate={
            selectedDate === "dateFrom" ? dateTo.toDate() : dayjs().toDate()
          }
          onChange={updateDatePicker}
          inline
        />
      )}
    </>
  );
}