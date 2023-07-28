import React, { useState } from "react";

import { dropdownStyle } from "./constants";
import { renderValue } from "./utils";
import DropDownBase from "../DropDownBase/DropDownBase";
import DateRangeSelectorMenu from "./DateRangeSelectorMenu";

function DateRangeSelector({
  preset,
  value,
  onChange,
  presets,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const handleClose = () => setOpen(false);

  const [dateFrom, dateTo] = value;

  return (
    <DropDownBase
      styles={dropdownStyle}
      open={open}
      value={value}
      onOpen={setOpen}
      onClose={handleClose}
      renderValue={() => renderValue(preset, presets, dateFrom, dateTo)}
    >
      <DateRangeSelectorMenu
        handleClose={handleClose}
        onChange={onChange}
        presets={presets}
        value={value}
        preset={preset}
      />
    </DropDownBase>
  );
}

export default DateRangeSelector;
