import { styled } from "@mui/material/styles";
import {ToggleButtonGroup} from "@mui/material";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: "10px",
    "&.Mui-disabled": {
      border: `1px solid #ddd !important`,
    },
    "&:not(:last-of-type)": {
      border: `1px solid gray`,
      borderRadius: 4,
    },
    "&:not(:first-of-type)": {
      border: `1px solid gray`,
      borderRadius: 4,
    },
  },
}));

export const toggleButtonStyle = {
  textTrasform: "none",
  width: "45%",
  color: "#333",
  borderColor: "#333",
  "&.Mui-selected": {
    borderColor: "blue !important",
    background: "none",
  },
};