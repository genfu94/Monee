import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { useOptions } from "./hooks";

export default function OptionSelector({ node, onChange, onBack, headerHeight }) {
  const [isChild, parentLabel, options] = useOptions({
    node,
  });

  return (
    <div className="options">
      <div
        className="header"
        style={{
          height: headerHeight,
          margin: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {isChild && (
          <>
            <IconButton size="small" onClick={onBack}>
              <IoChevronBackOutline />
            </IconButton>
            <span>{parentLabel}</span>
          </>
        )}
      </div>
      <List style={{ margin: 0, padding: 0 }}>
        {options.map((item) => {
          return (
            <ListItem
              onClick={() => onChange(item.key)}
              key={item.key}
              className="select-item"
            >
              {item.attributes.label}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
