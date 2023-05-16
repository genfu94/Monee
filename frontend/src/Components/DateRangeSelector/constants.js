export const dropdownStyle = {
  Button: {
    width: "250px",
    height: "40px",
    textTransform: "none",
    backgroundColor: "white",
    "&.MuiButton-outlined": {
      borderColor: "#dadada",
      "&:hover": {
        borderColor: "blue",
        backgroundColor: "white !important",
      },
    },
  },
  Menu: {
    left: "-25px",
    top: "50px",
    width: "300px",
    padding: "20px"
  }
};

export const radioStyle = {
  padding: "0px 5px 0px 0px",
  "& svg": {
    width: "13px",
    height: "13px",
    opacity: "0.6",
  },
};

export const datePickerStyle = {
  "& .MuiOutlinedInput-input": {
    fontSize: 12,
  }
}