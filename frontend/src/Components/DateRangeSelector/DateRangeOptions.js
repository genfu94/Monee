import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, ToggleButton } from "@mui/material";
import { dateRanges, radioStyle, datePickerStyle } from "./constants";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, ToggleButtonGroup } from "@mui/material";

function DateRangeOptions({
  setMenuValue,
  setMenuLabel,
  handleClose,
  defaultValue,
}) {
  const [value, setValue] = useState(defaultValue);
  const [dateFrom, setDateFrom] = useState(dayjs().subtract(30, "day"));
  const [dateTo, setDateTo] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
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
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="last_7_days"
          name="radio-buttons-group"
          style={{ display: "flex", flexDirection: "row" }}
          value={value}
          onChange={(_, value) => {
            if (value !== "custom_range") {
              const label = dateRanges.find(
                (item) => item.value === value
              ).label;
              setMenuLabel(label);
              setMenuValue(value);
              handleClose();
            }
            setValue(value);
          }}
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
        <ToggleButton
          sx={{
            textTrasform: "none",
            width: "45%",
            color: "#333",
            borderColor: "#333",
            "&.Mui-selected": {
              borderColor: "blue !important",
              background: "none"
            }
          }}
          selected={selectedDate === 0 ? true : false}
          onClick={() => setSelectedDate(0)}
          variant="outlined"
          disabled={value !== "custom_range"}
        >
          {dateFrom.format("DD-MM-YYYY")}
        </ToggleButton>
        <ToggleButton
          sx={{
            textTrasform: "none",
            width: "45%",
            color: "#333",
            borderColor: "#333",
            "&.Mui-selected": {
              borderColor: "blue !important",
              background: "none"
            }
          }}
          selected={selectedDate == 1 ? true : false}
          onClick={() => setSelectedDate(1)}
          variant="outlined"
          disabled={value !== "custom_range"}
        >
          {dateTo.format("DD-MM-YYYY")}
        </ToggleButton>
      </div>
      {value === "custom_range" && (
        <DatePicker
          minDate={selectedDate === 1 ? dateFrom.toDate() : null}
          maxDate={dayjs().toDate()}
          onChange={(date) => {
            selectedDate === 0 ? setDateFrom(dayjs(date[0])) : setDateTo(dayjs(date[0]))
          }}
          selectsRange
          inline
        />
      )}
    </div>
  );
}

export default DateRangeOptions;
