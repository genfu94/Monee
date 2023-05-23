import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import "./NestedSelector.style.css";

export default function NestedSelectorMenu({
  isChild,
  parentLabel = null,
  renderValue,
  options,
  onChange,
  onBack,
}) {
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
          <div data-testid="nested-menu-navigation">
            <IconButton data-testid="go-back-button" size="small" onClick={onBack}>
              <IoChevronBackOutline />
            </IconButton>
            <span>{parentLabel}</span>
          </div>
        )}
      </div>
      <List style={{ margin: 0, padding: 0 }}>
        {options.map((item) => {
          return (
            <ListItem
              data-testid="nested-menu-option"
              onClick={() => {
                onChange(item.value);
              }}
              key={item.value}
              className="select-item"
            >
              {renderValue(item.value)}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
