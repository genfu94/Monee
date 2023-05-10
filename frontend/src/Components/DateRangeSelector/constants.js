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

export const dateRanges = [
  {
    value: "last_7_days",
    label: "Last 7 days",
  },
  {
    value: "last_30_days",
    label: "Last 30 days",
  },
  {
    value: "last_90_days",
    label: "Last 90 days",
  },
  {
    value: "last_12_months",
    label: "Last 12 months",
  },
  {
    value: "all",
    label: "All",
  },
  {
    value: "custom_range",
    label: "Custom Range",
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "this_week",
    label: "This week",
  },
  {
    value: "this_month",
    label: "This month",
  },
  {
    value: "this_year",
    label: "This year",
  },
];

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