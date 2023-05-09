import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import "./NestedSelector.style.css";
import { useOptions } from "./hooks";

export default function NestedSelectorMenu({ node, setNodeByKey, goBack }) {
  const [isChild, parentLabel, options] = useOptions({
    node,
  });

  return (
    <div>
      <div
        className="header"
        style={{
          margin: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {isChild && (
          <>
            <IconButton size="small" onClick={goBack}>
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
              onClick={() => {
                setNodeByKey(item.key);
              }}
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
