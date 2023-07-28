import React, { useState } from "react";

import NestedSelectorMenu from "./NestedSelectorMenu";
import DropDownBase from "../DropDownBase/DropDownBase";
import { useNestedNavigation, useOptions } from "./hooks";

export default function NestedSelector({
  data,
  renderValue,
  value,
  onChange,
  styles = {},
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const handleClose = () => setOpen(false);

  styles.Menu = {
    ...styles.Menu,
    top: 0,
  };

  const [node, setNodeByKey, goBack] = useNestedNavigation({
    data,
    value,
    handleClose,
    onChange,
  });

  const [isChild, parentLabel] = useOptions({ node });
  return (
    <DropDownBase
      styles={styles}
      value={value}
      open={open}
      onClose={handleClose}
      onOpen={setOpen}
      renderValue={renderValue}
    >
      <NestedSelectorMenu
        isChild={isChild}
        parentLabel={parentLabel}
        renderValue={renderValue}
        options={node.children}
        onChange={setNodeByKey}
        onBack={goBack}
      />
    </DropDownBase>
  );
}
