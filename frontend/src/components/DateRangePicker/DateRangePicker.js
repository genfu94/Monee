import dayjs from "dayjs";
import React from "react";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDateRange, useDatePicker } from "./useDateRange";
import styled from "@emotion/styled";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "flex",
  width: "100%",
  justifyContent: "space-evenly",
  "& .MuiToggleButtonGroup-grouped": {
    "&.Mui-disabled": {
      border: `1px solid ${theme.borders.disabled} !important`,
      color: `${theme.borders.disabled} !important`,
    },
    "&:not(:last-of-type)": {
      border: `1px solid ${theme.borders.color}`,
      borderRadius: 4,
    },
    "&:not(:first-of-type)": {
      border: `1px solid ${theme.borders.color}`,
      borderRadius: 4,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTrasform: "none",
  color: theme.borders.color,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main + " !important",
    background: "none",
  },
}));

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        marginTop: "1rem",
      }}
    >
      <StyledToggleButtonGroup
        exclusive
        onChange={updateSelectedDate}
        disabled={disabled}
      >
        <StyledToggleButton
          selected={selectedDate === "dateFrom"}
          value="dateFrom"
          variant="outlined"
        >
          {dateFrom.format("DD-MM-YYYY")}
        </StyledToggleButton>
        <StyledToggleButton
          selected={selectedDate === "dateTo"}
          value="dateTo"
          variant="outlined"
        >
          {dateTo.format("DD-MM-YYYY")}
        </StyledToggleButton>
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
    </Box>
  );
}
