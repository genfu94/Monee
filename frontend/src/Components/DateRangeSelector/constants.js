import dayjs from "dayjs";

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

const getPreviousMonday = () => {
  const currWeekday = dayjs().day() === 0 ? 6 : dayjs().day() - 1;
  
  return dayjs().subtract(currWeekday, "day")
}

const getMonthStart = () => {
  let monthStart = dayjs();
  monthStart.set('day', 1);
  return monthStart;
}

const getYearStart = () => {
  let yearStart = dayjs();
  yearStart.set('month', 1);
  yearStart.set('day', 1)
  return yearStart;
}

export const dateRanges = [
  {
    value: "last_7_days",
    label: "Last 7 days",
    dateRange: [dayjs().subtract(7, "day"), dayjs()]
  },
  {
    value: "last_30_days",
    label: "Last 30 days",
    dateRange: [dayjs().subtract(30, "day"), dayjs()]
  },
  {
    value: "last_90_days",
    label: "Last 90 days",
    dateRange: [dayjs().subtract(90, "day"), dayjs()]
  },
  {
    value: "last_12_months",
    label: "Last 12 months",
    dateRange: [dayjs().subtract(12, "month"), dayjs()]
  },
  {
    value: "all",
    label: "All",
    dateRange: [null, dayjs().subtract(12, "month")]
  },
  {
    value: "custom_range",
    label: "Custom Range",
    dateRange: [null, null]
  },
  {
    value: "today",
    label: "Today",
    dateRange: [null, dayjs()]
  },
  {
    value: "this_week",
    label: "This week",
    dateRange: [getPreviousMonday(), dayjs()]
  },
  {
    value: "this_month",
    label: "This month",
    dateRange: [getMonthStart(), dayjs()]
  },
  {
    value: "this_year",
    label: "This year",
    dateRange: [getYearStart(), dayjs()]
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