import dayjs from "dayjs";
import React, { useState } from "react";

export const useDateRange = () => {
  const [selectedDate, setSelectedDate] = useState("dateFrom");

  const updateSelectedDate = (_, v) => {
    if (v !== null) setSelectedDate(v);
  };

  return [selectedDate, updateSelectedDate];
};

export const useDatePicker = (selectedDate, dateFrom, dateTo) => {
  const pickerDateSelected =
    selectedDate === "dateFrom" ? dateFrom.toDate() : dateTo.toDate();
  const pickerMinDate = selectedDate === "dateTo" ? dateFrom.toDate() : null;
  const pickerMaxDate =
    selectedDate === "dateFrom" ? dateTo.toDate() : dayjs().toDate();

  return [pickerDateSelected, pickerMinDate, pickerMaxDate];
};
