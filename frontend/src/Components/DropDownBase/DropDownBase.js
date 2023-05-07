import React from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";

import { defaultSx } from "./constants";
import { useDropdown } from "./hooks";
import "./DropDownBase.style.css";

function DropDownBase({ sx={}, menu: Menu }) {
  const buttonStyle = {
    ...defaultSx.Button,
    ...sx.Button,
  };

  const [containerRef, open, switchOpen] = useDropdown();
  const value = "";

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <Button
        sx={buttonStyle}
        onClick={switchOpen}
        fullWidth
        variant="outlined"
      >
        {value}
        <GoTriangleDown style={{ marginLeft: "auto" }} />
      </Button>
      {open && (
        <div className="drop-down-menu">
          <Menu onChange={() => console.log("Changed selected value")} />
        </div>
      )}
    </div>
  );
}

export default DropDownBase;
