import React from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";

import "./NestedSelector.style.css";
import { useSelectorButton } from "./hooks.js";
import OptionSelector from "./OptionSelector";
import { defaultSx } from "./constants";

export default function NestedSelector({ data, defaultValue, onChange, sx }) {
  const [
    node,
    setNodeByKey,
    goBack,
    key,
    value,
    open,
    switchOpen,
    selectorContainerRef,
  ] = useSelectorButton({
    data,
    defaultValue,
    onChange,
  });

  const buttonStyle = { ...defaultSx.Button, ...sx.Button };

  return (
    <div ref={selectorContainerRef} className="nested-select-container">
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
        <OptionSelector
          headerHeight={buttonStyle.height}
          node={node}
          onChange={setNodeByKey}
          onBack={goBack}
        />
      )}
    </div>
  );
}
