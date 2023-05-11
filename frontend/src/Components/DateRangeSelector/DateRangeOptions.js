import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, ToggleButton } from "@mui/material";
import { dateRanges, radioStyle, datePickerStyle } from "./constants";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, ToggleButtonGroup } from "@mui/material";
import ProvidedRangeMenu from "./ProvidedRangeMenu";

function DateRangeOptions({
  setMenuValue,
  setMenuLabel,
  handleClose,
  defaultValue,
}) {
  const [value, setValue] = useState(defaultValue);
  const [dateFrom, setDateFrom] = useState(dayjs().subtract(30, "day"));
  const [dateTo, setDateTo] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(0);

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
        <ProvidedRangeMenu value={value} onChange={(v) => setMenuLabel(v)}/>
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
          selected={selectedDate === 0 ? dateFrom.toDate() : dateTo.toDate()}
          minDate={selectedDate === 1 ? dateFrom.toDate() : null}
          maxDate={selectedDate === 0 ? dateTo.toDate() : dayjs().toDate()}
          onChange={(date) => {
            selectedDate === 0 ? setDateFrom(dayjs(date)) : setDateTo(dayjs(date));
            setMenuLabel(dateFrom.format('DD-MM-YYYY') + " - " + dateTo.format('DD-MM-YYYY'))
          }}
          inline
        />
      )}
    </div>
  );
}

export default DateRangeOptions;
