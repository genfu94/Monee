import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./UserProfile.style.css";
import { Button } from "@mui/material";
import { IoMdArrowDropdown } from "react-icons/io";
import {keycloak, userInfo} from "../../../keycloak.js"

function UserProfile() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="profile-dropdown-area"
      >
        <Avatar
          sx={{ bgcolor: deepOrange[500] }}
          style={{ width: '35px', height: '35px', fontSize: "20px" }}
        >
          {userInfo.username[0]}
        </Avatar>
        <div className="profile-user-name">
          <span>{userInfo.username}</span>
          <IoMdArrowDropdown />
        </div>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={() => keycloak.logout()}>Logout</MenuItem>
      </Menu>
    </>
  );
}

export default UserProfile;
