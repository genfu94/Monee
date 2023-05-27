import { useFormik } from "formik";
import React, { useState } from "react";
import { FormControlLabel, Typography, Checkbox } from "@mui/material";
import { AiFillEye } from "react-icons/ai";

const CheckboxGroup = ({ options, value, onChange }) => {
  const handleChange = (checked, itemValue) => {
    if (!checked) {
      onChange(value.filter((v) => v !== itemValue));
    } else {
      onChange([...value, itemValue]);
    }
  };

  return (
    <div>
      {options.map((item) => (
        <FormControlLabel
          key={item.value}
          label={<Typography variant="small">{item.label}</Typography>}
          control={
            <Checkbox
              checked={value.includes(item.value)}
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
