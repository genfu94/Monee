import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { GoTriangleDown } from "react-icons/go";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { IoChevronBackOutline } from "react-icons/io5";

import "./NestedSelector.style.css";

export default function NestedSelector({ data, sx }) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState([data]);
  const [value, setValue] = useState(null);
  const [parent, setParent] = useState("");

  const switchOpen = () => setOpen(!open);
  const addLevel = (v) => {
    if (v.submenu === null || v.submenu.length == 0) {
      setOpen(false);
      setValue(v.label);
    } else {
      setParent(v.value);
      setLevel((oldLevel) => [v.submenu, ...oldLevel]);
    }
  };
  const goBackLevel = () => setLevel((level) => level.filter((l, i) => i != 0));

  const defaultSx = {
    Button: {
      width: "100%",
      height: "50px",
      borderColor: "inherit",
      textTransform: "none",
    }
  };

  return (
    <div className="nested-select-container">
      <Button sx={{...defaultSx.Button, ...sx.Button}} onClick={switchOpen} variant="outlined">
        {value}
        <GoTriangleDown style={{ marginLeft: "auto" }} />
      </Button>
      {open && (
        <div className="options">
          {level.length > 1 && (
            <div className="header" style={{"height": {...defaultSx.Button, ...sx.Button}.height, margin: 0, display: "flex", alignItems: "center"}}>
              <IconButton size="small" onClick={goBackLevel}>
                <IoChevronBackOutline />
              </IconButton>
              <span>{parent}</span>
            </div>
          )}
          <List>
            {level[0].map((item, idx) => {
              return (
                <ListItem
                  onClick={() => addLevel(item)}
                  key={idx}
                  className="select-item"
                >
                  {item.label}
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
    </div>
  );
}