import React, { useState } from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";

import { defaultSx } from "./constants";
import { useClickOut } from "./hooks";

function DropDownBase({
  sx = {},
  value = null,
  onOpen,
  onClose,
  open,
  renderValue,
  children,
}) {
  const buttonStyle = {
    ...defaultSx.Button,
    ...sx.Button,
  };

  const menuStyle = {
    ...defaultSx.Menu,
    ...sx.Menu,
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
        {renderValue ? renderValue(value) : value}
        <GoTriangleDown style={{ marginLeft: "auto" }} />
      </Button>
      {open && <div style={menuStyle}>{children}</div>}
    </div>
  );
}

export default DropDownBase;
