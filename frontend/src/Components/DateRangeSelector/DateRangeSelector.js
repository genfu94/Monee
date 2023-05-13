import React, { useState } from "react";

import { dropdownStyle } from "./constants";
import DropDownBase from "../DropDownBase/DropDownBase";
import { dateRanges } from "./constants";
import dayjs from "dayjs";
import ProvidedRangeMenu from "./ProvidedRangeMenu";
import DateRangePicker from "./DateRangePicker";

function DateRangeSelector() {
  const initialDate = dateRanges[1];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialDate.value);
  const handleClose = () => setOpen(false);

  const [dateFrom, setDateFrom] = useState(initialDate.dateRange[0]);
  const [dateTo, setDateTo] = useState(initialDate.dateRange[1]);

  const updateDate = (from, to) => {
    setDateFrom(from);
    setDateTo(to);
  };

  const renderValue = (value) => {
    if(value !== "custom_range") {
      return dateRanges.find((item) => item.value == value).label;
    }
    
    return `${dateFrom.format('DD-MM-YYYY')} - ${dateTo.format('DD-MM-YYYY')}`
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
        <ProvidedRangeMenu value={value} onChange={setValue}/>
      </div>

      <DateRangePicker
        value={[dateFrom, dateTo]}
        onChange={updateDate}
        disabled={value !== "custom_range"}
      />
    </DropDownBase>
  );
}

export default DateRangeSelector;
