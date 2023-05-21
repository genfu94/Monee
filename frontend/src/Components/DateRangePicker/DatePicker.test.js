import { useDatePicker } from "./useDateRange";
import dayjs from "dayjs";

function resetTime(d) {
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
}

let startDate, endDate;
beforeEach(() => {
  var customParseFormat = require('dayjs/plugin/customParseFormat')
  dayjs.extend(customParseFormat)
  startDate = dayjs("25-05-2020", "DD-MM-YYYY");
  endDate = dayjs("30-05-2020", "DD-MM-YYYY");
})

describe("When selected button is dateFrom", () => {
  it("the max selectable date is set to dateTo", () => {
    const [pickerDateSelected, pickerMinDate, pickerMaxDate] = useDatePicker(
      "dateFrom",
      startDate,
      endDate
    );
    expect(pickerMaxDate.getTime()).toBe(endDate.toDate().getTime());
  });

  it("min date is set to null", () => {
    const [pickerDateSelected, pickerMinDate, pickerMaxDate] = useDatePicker(
      "dateFrom",
      startDate,
      endDate
    );
      
    expect(pickerMinDate).toBe(null);
  });
})

describe("When selected button is dateTo", () => {
  it("max date is set to today", () => {
    const [pickerDateSelected, pickerMinDate, pickerMaxDate] = useDatePicker(
      "dateTo",
      startDate,
      endDate
    );
    const today = dayjs().toDate();
    resetTime(pickerMaxDate);
    resetTime(today);
    
    expect(pickerMaxDate.getTime()).toBe(today.getTime());
  });

  it("min date is set to dateFrom", () => {
    const [pickerDateSelected, pickerMinDate, pickerMaxDate] = useDatePicker(
      "dateTo",
      startDate,
      endDate
    );
    resetTime(pickerMinDate);

    expect(pickerMinDate.getTime()).toBe(startDate.toDate().getTime());
  });
});
