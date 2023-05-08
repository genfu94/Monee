import React, {useState} from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";

import { defaultSx } from "./constants";
import { useDropdownInput } from "./hooks";
import "./DropDownBase.style.css";

function DropDownBase({ sx={}, initialLabel=null, menu: Menu, children }) {
  const buttonStyle = {
    ...defaultSx.Button,
    ...sx.Button,
  };

  const [label, setLabel] = useState(initialLabel);
  const [containerRef, open, switchOpen] = useDropdownInput();
  const updateLabel = (l) => {
    setLabel(l);
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
          <Menu updateLabel={updateLabel}/>
        </div>
      )}
    </div>
  );
}

export default DropDownBase;
