import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./style.css";
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import {IoMdArrowDropdown} from "react-icons/io";

function UserProfile() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const CustomButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    lineHeight: 1.5,
  });

  return (
    <>
      <CustomButton onClick={handleClick} className="profile-dropdown-area">
        <Avatar sx={{ bgcolor: deepOrange[500] }} style={{width: 32, height: 32, fontSize: '0.8em'}}>U</Avatar>
        <div className="profile-user-name">User</div>
        <IoMdArrowDropdown/>
      </CustomButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
      </Menu>
    </>
  );
}

export default UserProfile;
