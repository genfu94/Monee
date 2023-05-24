export const dropdownStyle = {
  Button: {
    width: "100%",
    height: "2.5rem",
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
    width: "300px",
    marginTop: '10px',
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