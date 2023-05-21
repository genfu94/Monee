import dayjs from "dayjs";
import React from "react";
import { ToggleButton } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDateRange, useDatePicker } from "./useDateRange";

import {
  StyledToggleButtonGroup,
  toggleButtonStyle,
} from "./DateRangePicker.style";

export default function DateRangePicker({ value, onChange, disabled = false }) {
  const [dateFrom, dateTo] = value;
  const [selectedDate, updateSelectedDate] = useDateRange();
  const [pickerDateSelected, pickerMinDate, pickerMaxDate] = useDatePicker(
    selectedDate,
    dateFrom,
    dateTo
  );

  const onDatePicked = (date) => {
    if (selectedDate === "dateFrom") onChange(dayjs(date), dateTo);
    else onChange(dateFrom, dayjs(date));
  };

  return (
    <>
      <StyledToggleButtonGroup
        exclusive
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
          id="date-range-picker"
          selected={pickerDateSelected}
          minDate={pickerMinDate}
          maxDate={pickerMaxDate}
          onChange={onDatePicked}
          inline
        />
      )}
    </>
  );
}
