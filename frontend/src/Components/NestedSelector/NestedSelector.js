import React from "react";

import NestedSelectorMenu from "./NestedSelectorMenu";
import DropDownBase from "../DropDownBase/DropDownBase";

export default function NestedSelector({ data, defaultValue, onChange, sx }) {
  return <DropDownBase sx={sx} menu={NestedSelectorMenu} data={data} defaultValue={defaultValue} onChange={onChange} />;
}
