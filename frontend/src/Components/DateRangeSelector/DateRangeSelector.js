import React, { useState } from "react";

import {appendCustomRangePreset} from "./utils";
import { dropdownStyle } from "./constants";
import { renderValue } from "./utils";
import DropDownBase from "../DropDownBase/DropDownBase";
import DateRangeSelectorMenu from "./DateRangeSelectorMenu";

function DateRangeSelector({ preset, value, onChange, presets, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const handleClose = () => setOpen(false);

  const [dateFrom, dateTo] = value;
  const dateRangePresets = appendCustomRangePreset(presets);

  return (
    <DropDownBase
      sx={dropdownStyle}
      open={open}
      value={value}
      onOpen={setOpen}
      onClose={handleClose}
      renderValue={() =>
        renderValue(preset, dateRangePresets, dateFrom, dateTo)
      }
    >
      <DateRangeSelectorMenu handleClose={handleClose} onChange={onChange} presets={dateRangePresets} value={value} preset={preset}/>
    </DropDownBase>
  );
}

export default DateRangeSelector;
