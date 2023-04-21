import React, { useState } from "react";
import Button from "@mui/material/Button";
import { GoTriangleDown } from "react-icons/go";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import "./NestedSelector.style.css";

export default function NestedSelector() {
  const data = [
    {
      label: <div>ASD</div>,
      submenu: [
        {
          value: 0,
          label: <div>LOL</div>,
          submenu: []
        },
      ],
    },
  ];
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState([data]);
  const [value, setValue] = useState(null);
  const switchOpen = () => setOpen(!open);
  const addLevel = (v) => {
    if (v.submenu == null || v.submenu.length == 0) {
      console.log("XDDDD")
      setOpen(false);
      setValue(v.label);
    } else {
      setLevel((oldLevel) => [v.submenu, ...oldLevel])
    }
  }
  const goBackLevel = () => setLevel(level => level.filter((l,i)=>(i != 0)))

  return (
    <div className="nested-select-container">
      <Button
        onClick={switchOpen}
        variant="outlined"
        sx={{ width: "100%", height: "50px", borderColor: "inherit" }}
      >
        {value}
        <GoTriangleDown style={{ marginLeft: "auto" }} />
      </Button>
      {open && (
        <div className="options">
          {level.length > 1 && <Button onClick={goBackLevel} variant="outlined">Go Back</Button>}
          <List>
            {level[0].map((item, idx) => {
              return (
                <ListItem onClick={() => addLevel(item)} key={idx} className="select-item">
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
