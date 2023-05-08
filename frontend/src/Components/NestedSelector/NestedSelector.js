import React from "react";

import NestedSelectorMenu from "./NestedSelectorMenu";
import DropDownBase from "../DropDownBase/DropDownBase";
import { useNestedNavigation } from "./hooks";

export default function NestedSelector({ data, defaultValue, sx }) {
  const [node, initialLabel, setNode, tree] = useNestedNavigation({
    data,
    defaultValue,
  });

  return (
    <DropDownBase
      sx={sx}
      initialLabel={initialLabel}
      menu={(updateLabel) =>
        NestedSelectorMenu({ node, setNode, tree, updateLabel })
      }
    />
  );
}
