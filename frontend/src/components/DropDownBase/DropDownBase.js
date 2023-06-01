import React, { useState } from "react";
import {Button, Box} from "@mui/material";
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
    <Box ref={containerRef} style={{ position: "relative" }}>
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
      {open && <Box style={menuStyle}>{children}</Box>}
    </Box>
  );
}

export default DropDownBase;
