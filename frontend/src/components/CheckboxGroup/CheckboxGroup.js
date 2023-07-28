import React from "react";
import { FormControlLabel, Typography, Checkbox } from "@mui/material";
import { AiFillEye } from "react-icons/ai";

const CheckboxGroup = ({ options, value, onChange, selectAll = true }) => {
  const checkboxes = selectAll
    ? [{ value: "__selectall__", label: "Select All" }, ...options]
    : options;
  const handleChange = (checked, itemValue) => {
    if (!checked) onChange(value.filter((v) => v !== itemValue));
    else {
      if (itemValue === "__selectall__") onChange(options.map((v) => v.value));
      else onChange([...value, itemValue]);
    }
  };

  const isSelected = (v) => {
    if (v === "__selectall__" && value.length === options.length) return true;
    return value.includes(v);
  };

  return (
    <div>
      {checkboxes.map((item) => (
        <FormControlLabel
          key={item.value}
          label={<Typography variant="small">{item.label}</Typography>}
          control={
            <Checkbox
              checked={isSelected(item.value)}
              value={item.value}
              icon={<AiFillEye />}
              checkedIcon={<AiFillEye />}
              onChange={(e) => handleChange(e.target.checked, item.value)}
            />
          }
        />
      ))}
    </div>
  );
};

export default CheckboxGroup;
