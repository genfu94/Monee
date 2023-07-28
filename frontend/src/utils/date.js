import dayjs from "dayjs";

export const getPreviousMonday = () => {
  const currWeekday = dayjs().day() === 0 ? 6 : dayjs().day() - 1;

  return dayjs().subtract(currWeekday, "day");
};

export const getMonthStart = () => {
  let monthStart = dayjs();
  monthStart = monthStart.set("date", 1);
  return new Date(monthStart.toDate().setHours(0, 0, 0, 0));
};

export const getYearStart = () => {
  let yearStart = dayjs();
  yearStart.set("month", 1);
  yearStart.set("day", 1);
  return yearStart;
};

export const DATE_RANGE_PRESETS = [
  {
    presetId: "last_7_days",
    label: "Last 7 days",
    value: [dayjs().subtract(7, "day"), dayjs()],
  },
  {
    presetId: "last_30_days",
    label: "Last 30 days",
    value: [dayjs().subtract(30, "day"), dayjs()],
  },
  {
    presetId: "last_90_days",
    label: "Last 90 days",
    value: [dayjs().subtract(90, "day"), dayjs()],
  },
  {
    presetId: "last_12_months",
    label: "Last 12 months",
    value: [dayjs().subtract(12, "month"), dayjs()],
  },
  {
    presetId: "this_week",
    label: "This week",
    value: [getPreviousMonday(), dayjs()],
  },
  {
    presetId: "this_month",
    label: "This month",
    value: [getMonthStart(), dayjs()],
  },
  {
    presetId: "this_year",
    label: "This year",
    value: [getYearStart(), dayjs()],
  },
];
