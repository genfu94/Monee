import React, { useState } from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";

import { defaultSx } from "./constants";
import { useClickOut } from "./hooks";
import "./DropDownBase.style.css";

function DropDownBase({ sx = {}, value = null, onOpen, onClose, open, children }) {
  const buttonStyle = {
    ...defaultSx.Button,
    ...sx.Button,
  };

  const [containerRef] = useClickOut(onClose);
  const switchOpen = open ? onClose : onOpen;

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
      {open && <div className="drop-down-menu">{children}</div>}
    </div>
  );
}

export default DropDownBase;
