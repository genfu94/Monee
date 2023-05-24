import React, { useState } from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";

import { getBaseStyles } from "./constants";
import { useClickOut } from "./hooks";

function DropDownBase({
  styles = {},
  value = null,
  onOpen,
  onClose,
  open,
  renderValue,
  children,
}) {
  const baseStyles = getBaseStyles();

  const buttonStyle = {
    ...baseStyles.Button,
    ...styles.Button,
  };

  const menuStyle = {
    ...baseStyles.Menu,
    ...styles.Menu,
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
        data-testid="dropdown-button"
      >
        {renderValue ? renderValue(value) : value}
        <GoTriangleDown style={{ marginLeft: "auto" }} />
      </Button>
      {open && <div style={menuStyle}>{children}</div>}
    </div>
  );
}

export default DropDownBase;
