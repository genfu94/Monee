import React, { useState } from "react";

import { dropdownStyle } from "./constants";
import DropDownBase from "../DropDownBase/DropDownBase";
import DateRangeOptions from "./DateRangeOptions";

function DateRangeSelector() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const handleClose = () => setOpen(false);

  return (
    <DropDownBase sx={dropdownStyle} open={open} value={value} onOpen={setOpen} onClose={handleClose}>
      <DateRangeOptions/>
    </DropDownBase>
  );
}

export default DateRangeSelector;
