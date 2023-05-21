import DateRangeSelectorMenu from "./DateRangeSelectorMenu";
import DateRangeSelector from "./DateRangeSelector";
import dayjs from "dayjs";
import {render, screen, fireEvent, findByText} from "@testing-library/react";
import '@testing-library/jest-dom';

let dateRangeSelectorMenu;
let dateRangeSelector;
const mockHandleClose = jest.fn();
const mockOnChange = jest.fn();
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);
const startDate = dayjs("25-05-2020", "DD-MM-YYYY");
const endDate = dayjs("30-05-2020", "DD-MM-YYYY");
const presets = [
  {
    presetId: "last_7_days",
    label: "Last 7 days",
    value: [null, null]
  },
  {
    presetId: "last_30_days",
    label: "Last 30 days",
    value: [null, null]
  }
];

const defaultPreset = presets[0];

beforeEach(() => {
  dateRangeSelectorMenu = (
    <DateRangeSelectorMenu
      handleClose={mockHandleClose}
      onChange={mockOnChange}
      presets={presets}
      preset={defaultPreset.presetId}
      value={[startDate, endDate]}
    />
  );

  dateRangeSelector = (
    <DateRangeSelector
      onChange={mockOnChange}
      presets={presets}
      preset={defaultPreset.presetId}
      defaultOpen={true}
      value={[startDate, endDate]}
    />
  )
})

describe("On component mount", () =>  {
  it("the selected value is the default preset", async () => {
    render(dateRangeSelector);

    const dropdownButton = screen.getByTestId("dropdown-button");
    expect(await findByText(dropdownButton, defaultPreset.label)).toBeVisible()
  });
})

describe("When the user select a new preset", () => {
  it("shows the new selected value", () => {
    /*const button = screen.getAllByRole("radio")[1];
    console.log(button)
    fireEvent.click(button);

    expect(mockOnChange).toHaveBeenCalled();*/
  });

  it("invokes the onchange method with the new value", () => {

  });

  it("closes the dropdown if the value is not custom range", () => {

  });

  it("doesn't close the dropdown and shows the date picker if the selected preset is custom range ", () => {

  })
})