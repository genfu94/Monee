import React, { useState } from "react";

import { dropdownStyle } from "./constants";
import DropDownBase from "../DropDownBase/DropDownBase";
import DateRangeOptions from "./DateRangeOptions";
import { dateRanges } from "./constants";

function DateRangeSelector() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(dateRanges[0].value);
  const [label, setLabel] = useState(dateRanges[0].label);
  const handleClose = () => setOpen(false);

  return (
    <DropDownBase sx={dropdownStyle} open={true} value={label} onOpen={setOpen} onClose={handleClose}>
      <DateRangeOptions defaultValue={value} setMenuValue={setValue} setMenuLabel={setLabel} handleClose={handleClose}/>
    </DropDownBase>
  );
}

export default DateRangeSelector;
