import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NestedSelectorMenu from "./NestedSelectorMenu";

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

const mockOnChange = jest.fn();
const mockOnBack = jest.fn();

const renderValue = (v) => ValueToLabel[v];

const mockChildNestedSelectorMenu = (
  <NestedSelectorMenu
    isChild={true}
    parentLabel={renderValue(nestedData[0].value)}
    options={nestedData[0].children}
    renderValue={renderValue}
    onChange={mockOnChange}
    onBack={mockOnBack}
  />
);

const mockRootNestedSelectorMenu = (
  <NestedSelectorMenu
    isChild={false}
    options={nestedData}
    renderValue={renderValue}
    onChange={mockOnChange}
    onBack={mockOnBack}
  />
);

it("When it is root doesn't show the parentLabel", () => {
  render(mockRootNestedSelectorMenu);

  expect(screen.queryByTestId('nested-menu-navigation')).toBe(null);
});

it("Correctly list the options", () => {
  render(mockRootNestedSelectorMenu);

  const renderedOptions = screen.getAllByTestId('nested-menu-option');
  expect(renderedOptions.length).toBe(1);
  expect(renderedOptions[0].textContent).toBe('Value 1');
});

it("When it is child it shows the parentLabel", () => {
  render(mockChildNestedSelectorMenu);

  expect(screen.queryByTestId('nested-menu-navigation')).toBeVisible();
});

it("Invokes the onBack callback when clicking on the back arrow", () => {
  render(mockChildNestedSelectorMenu);

  const goBackButton = screen.getByTestId("go-back-button");
  fireEvent.click(goBackButton);
  expect(mockOnBack).toHaveBeenCalled();
});

it("Invokes the onChange callback when clicking on an option", () => {
  render(mockRootNestedSelectorMenu);

  const renderedOptions = screen.getAllByTestId('nested-menu-option');
  fireEvent.click(renderedOptions[0]);
  expect(mockOnChange).toHaveBeenCalled();
});
