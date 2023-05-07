import React,{useState} from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";

import { defaultSx } from "./constants";
import { useDropdown } from "./hooks";
import "./DropDownBase.style.css";

function DropDownBase({ sx={}, defaultValue=null, data=null, menu: Menu, onChange=() => {} }) {
  const buttonStyle = {
    ...defaultSx.Button,
    ...sx.Button,
  };

  const [containerRef, open, switchOpen] = useDropdown();
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState(null);

  const setChoice = (v, l) => {
    setValue(v);
    setLabel(l);
    onChange(v);
    switchOpen();
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <Button
        sx={buttonStyle}
        onClick={switchOpen}
        fullWidth
        variant="outlined"
      >
        {label}
        <GoTriangleDown style={{ marginLeft: "auto" }} />
      </Button>
      {open && (
        <div className="drop-down-menu">
          <Menu defaultValue={defaultValue} data={data} onChange={setChoice} />
        </div>
      )}
    </div>
  );
}

export default DropDownBase;
