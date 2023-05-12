import React, { useState } from "react";

import { dropdownStyle } from "./constants";
import DropDownBase from "../DropDownBase/DropDownBase";
import DateRangeOptions from "./DateRangeOptions";
import { dateRanges } from "./constants";

function DateRangeSelector() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(dateRanges[0].value);
  const handleClose = () => setOpen(false);

  return (
    <DropDownBase sx={dropdownStyle} open={open} value={value} onOpen={setOpen} onClose={handleClose}>
      <DateRangeOptions value={value} onChange={setValue}/>
    </DropDownBase>
  );
}

export default DateRangeSelector;
