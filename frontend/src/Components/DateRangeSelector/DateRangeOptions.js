import React, { useState } from "react";
import dayjs from "dayjs";
import ProvidedRangeMenu from "./ProvidedRangeMenu";
import DateRangePicker from "./DateRangePicker";

function DateRangeOptions({
  value,
  onChange
}) {
  const [dateFrom, setDateFrom] = useState(dayjs().subtract(30, "day"));
  const [dateTo, setDateTo] = useState(dayjs());
  const updateDate = (from, to) => {
    setDateFrom(from);
    setDateTo(to);
  }

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
        <ProvidedRangeMenu value={value} onChange={onChange} />
      </div>

      <DateRangePicker
        value={[dateFrom, dateTo]}
        onChange={updateDate}
        disabled={value !== 'custom_range'}
      />
    </div>
  );
}

export default DateRangeOptions;
