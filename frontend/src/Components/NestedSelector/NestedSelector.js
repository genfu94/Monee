import React, {useState} from "react";

import NestedSelectorMenu from "./NestedSelectorMenu";
import DropDownBase from "../DropDownBase/DropDownBase";
import { useNestedNavigation } from "./hooks";

export default function NestedSelector({ data, defaultValue, sx, onChange }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(null);
  const handleClose = () => setOpen(false);

  const [node, setNodeByKey, goBack] = useNestedNavigation({
    data,
    defaultValue,
    handleClose,
    setLabel,
    onChange
  });
  

  return (
    <DropDownBase
      sx={sx}
      value={label}
      open={open}
      onClose={handleClose}
      onOpen={setOpen}
    >
      <NestedSelectorMenu node={node} setNodeByKey={setNodeByKey} goBack={goBack}/>
    </DropDownBase>
  );
}
