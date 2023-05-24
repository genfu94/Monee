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
    width: "19rem",
    marginTop: '0.6rem',
    padding: "1.25rem"
  }
};

export const radioStyle = {
  padding: "0px 0.5rem 0px 0px",
  "& svg": {
    width: "0.8rem",
    height: "0.8rem",
    opacity: "0.6",
  },
};

export const datePickerStyle = {
  "& .MuiOutlinedInput-input": {
    fontSize: '0.8rem',
  }
}