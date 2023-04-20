import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";


export const labelStyle = {
  fontFamily: "Montserrat",
  fontSize: "16px",
  fontWeight: "600",
  margin: "7px 0px 7px 0px"
};

export const buttonToggleStyle = {
  "&": {
    textTransform: "none",
    fontFamily: "Montserrat",
    color: "rgb(150, 150, 150)",
    borderColor: "blue",
    height: "47px",
  },
  "&.Mui-selected": {
    backgroundColor: "blue !important",
    color: "white",
    fontWeight: "bold",
  },
  "&.Mui-hover": {
    backgroundColor: "rgb(255, 255, 255 \0.1)",
  },
};

export const AmountTextField = styled(TextField)({
  display: "inline-block",
  width: "100px",
  input: {
    height: "14px",
    fontSize: "20px",
    color: "#c6d065",
    fontWeight: "700",
    fontFamily: "Montserrat",
  }
});

