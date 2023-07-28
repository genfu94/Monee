import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import "./NestedSelector.style.css";
import { Box, ListItem, List, IconButton, Typography } from "@mui/material";

export default function NestedSelectorMenu({
  isChild,
  parentLabel = null,
  renderValue,
  options,
  onChange,
  onBack,
}) {
  return (
    <Box>
      <Box
        className="header"
        style={{
          margin: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {isChild && (
          <Box data-testid="nested-menu-navigation">
            <IconButton
              data-testid="go-back-button"
              size="small"
              onClick={onBack}
            >
              <IoChevronBackOutline />
            </IconButton>
            <Typography style={{ display: "inline" }}>{parentLabel}</Typography>
          </Box>
        )}
      </Box>
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
    </Box>
  );
}
