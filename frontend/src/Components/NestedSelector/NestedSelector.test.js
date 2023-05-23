import { render, screen, getByText, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NestedSelector from "./NestedSelector";

const nestedData = [
  {
    value: "value1",
    children: [
      {
        value: "value2",
        children: [
          {
            value: "value3",
          },
        ],
      },
    ],
  },
];

const ValueToLabel = {
  value1: "Value 1",
  value2: "Value 2",
  value3: "Value 3",
};
const renderValue = (v) => ValueToLabel[v];

let mockOnChange, mockNestedSelector;

beforeEach(() => {
  mockOnChange = jest.fn();

  mockNestedSelector = (
    <NestedSelector
      defaultOpen={true}
      data={nestedData}
      renderValue={renderValue}
      value={nestedData[0].value}
      onChange={mockOnChange}
    />
  );
});

it("Renders the selected value correctly", () => {
  render(mockNestedSelector);

  const dropdownButton = screen.getByTestId("dropdown-button");
  expect(getByText(dropdownButton, "Value 1")).toBeVisible();
});

it("Shows the corrected values", () => {
  render(mockNestedSelector);

  const renderedNewOptions = screen.getAllByTestId("nested-menu-option");
  expect(renderedNewOptions.length).toBe(1);
  expect(renderedNewOptions[0].textContent).toBe("Value 1");
});

it("Updates the menu correctly when select option is not leaf", () => {
  render(mockNestedSelector);

  const renderedOptions = screen.getAllByTestId("nested-menu-option");
  fireEvent.click(renderedOptions[0]);
  const renderedNewOptions = screen.getAllByTestId("nested-menu-option");
  expect(renderedNewOptions.length).toBe(1);
  expect(renderedNewOptions[0].textContent).toBe("Value 2");
});

it("Invokes the onChange callback when selected option is leaf", () => {
  render(mockNestedSelector);

  let renderedOptions = screen.getAllByTestId("nested-menu-option");
  fireEvent.click(renderedOptions[0]);
  renderedOptions = screen.getAllByTestId("nested-menu-option");
  fireEvent.click(renderedOptions[0]);
  renderedOptions = screen.getAllByTestId("nested-menu-option");
  fireEvent.click(renderedOptions[0]);
  expect(mockOnChange.mock.calls.length).toBe(1);
});
