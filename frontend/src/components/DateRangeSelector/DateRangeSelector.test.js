import DateRangeSelectorMenu from "./DateRangeSelectorMenu";
import DateRangeSelector from "./DateRangeSelector";
import dayjs from "dayjs";
import { render, screen, fireEvent, findByText } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../../theme";

let dateRangeSelectorMenu;
let dateRangeSelector;
const mockHandleClose = jest.fn();
const mockOnChange = jest.fn();
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const startDate = dayjs("25-05-2020", "DD-MM-YYYY");
const endDate = dayjs("30-05-2020", "DD-MM-YYYY");
const presets = [
  {
    presetId: "last_7_days",
    label: "Last 7 days",
    value: [null, null],
  },
  {
    presetId: "last_30_days",
    label: "Last 30 days",
    value: [null, null],
  },
];

const defaultPreset = presets[0];

beforeEach(() => {
  dateRangeSelectorMenu = (
    <ThemeProvider theme={theme}>
      <DateRangeSelectorMenu
        handleClose={mockHandleClose}
        onChange={mockOnChange}
        presets={presets}
        preset={defaultPreset.presetId}
        value={[startDate, endDate]}
      />
    </ThemeProvider>
  );

  dateRangeSelector = (
    <ThemeProvider theme={theme}>
      <DateRangeSelector
        onChange={mockOnChange}
        presets={presets}
        preset={defaultPreset.presetId}
        defaultOpen={true}
        value={[startDate, endDate]}
      />
    </ThemeProvider>
  );
});

describe("On component mount", () => {
  it("the selected value is the default preset", async () => {
    render(dateRangeSelector);

    const dropdownButton = screen.getByTestId("dropdown-button");
    expect(await findByText(dropdownButton, defaultPreset.label)).toBeVisible();
  });
});

describe("When the user select a new preset", () => {
  it("invokes the onchange method with the new value", async () => {
    render(dateRangeSelector);

    const button = screen.getAllByRole("radio")[1];
    fireEvent.click(button);
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange.mock.calls[0][0]).toBe(presets[1].presetId);
  });

  it("closes the dropdown if the value is not custom range", () => {
    render(dateRangeSelectorMenu);

    const button = screen.getAllByRole("radio")[1];
    fireEvent.click(button);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("doesn't close the dropdown if the selected preset is custom range", () => {
    render(dateRangeSelectorMenu);

    const button = screen.getAllByRole("radio")[2];
    fireEvent.click(button);
    expect(mockHandleClose).not.toHaveBeenCalled();
  });

  it("hide date range picker if selected preset is not custom range", () => {
    const { container } = render(dateRangeSelectorMenu);
    expect(container.querySelector(".react-datepicker")).toBe(null);
  });

  it("shows the date range picker if the selected preset is custom range", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <DateRangeSelectorMenu
          handleClose={mockHandleClose}
          onChange={mockOnChange}
          presets={presets}
          preset="custom_range"
          value={[startDate, endDate]}
        />
      </ThemeProvider>
    );

    expect(container.querySelector(".react-datepicker")).toBeVisible();
  });
});
