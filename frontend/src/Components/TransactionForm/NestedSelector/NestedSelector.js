import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { GoTriangleDown } from "react-icons/go";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { IoChevronBackOutline } from "react-icons/io5";

import { findCategoryByValue } from "../../categories";
import "./NestedSelector.style.css";

export default function NestedSelector({ data, sx, onChange, value="Unknown" }) {
  const [state, parentCat, label] = findCategoryByValue(data, "", value);
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(state);
  const [selectedValue, setSelectedValue] = useState(label);
  const [parent, setParent] = useState(parentCat);

  const switchOpen = () => setOpen(!open);
  const addLevel = (v) => {
    if (v.submenu === null || v.submenu.length == 0) {
      setOpen(false);
      setSelectedValue(v.label);
      onChange(v.value);
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
    },
  };

  const ref = useRef(null);

  const onClickOutside = () => setOpen(false);
  value = selectedValue;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <div ref={ref} className="nested-select-container">
      <Button
        sx={{ ...defaultSx.Button, ...sx.Button }}
        onClick={switchOpen}
        variant="outlined"
      >
        {value}
        <GoTriangleDown style={{ marginLeft: "auto" }} />
      </Button>
      {open && (
        <div className="options">
          <div
            className="header"
            style={{
              height: { ...defaultSx.Button, ...sx.Button }.height,
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {level.length > 1 && (
              <>
                <IconButton size="small" onClick={goBackLevel}>
                  <IoChevronBackOutline />
                </IconButton>
                <span>{parent}</span>
              </>
            )}
          </div>
          <List style={{ margin: 0, padding: 0 }}>
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
