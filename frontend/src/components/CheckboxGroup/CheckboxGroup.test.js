import CheckboxGroup from "./CheckboxGroup";
import { render, screen, fireEvent } from "@testing-library/react";

const mockOnChange = jest.fn();
const mockSelectAllCheckboxGroup = (
  <CheckboxGroup
    options={[
      {
        label: "Option 1",
        value: "option1",
      },
      {
        label: "Option 2",
        value: "option2",
      },
    ]}
    value={["option1", "option2"]}
    onChange={mockOnChange}
  />
);

const mockCheckboxGroup = (
  <CheckboxGroup
    options={[
      {
        label: "Option 1",
        value: "option1",
      },
      {
        label: "Option 2",
        value: "option2",
      },
    ]}
    value={["option1"]}
    onChange={mockOnChange}
  />
);

describe("When all checkboxes are selected", () => {
  it("Also automatically checks the select all option", () => {
    render(mockSelectAllCheckboxGroup);

    const checkboxInput = screen.getAllByRole("checkbox")[0];
    expect(checkboxInput.checked).toBe(true);
  });

  it("nothing changes when clicking the select all option", () => {
    render(mockSelectAllCheckboxGroup);

    const checkboxInputs = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxInputs[0]);
    for (const checkbox of checkboxInputs) {
      expect(checkbox.checked).toBe(true);
    }
  });

  it("Clicking on a previously checked option invokes the onChange properly", () => {
    render(mockCheckboxGroup);

    const checkboxInputs = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxInputs[1]);

    expect(mockOnChange.mock.calls[0][0]).toEqual([]);
  });
});

describe("When not all checkboxes are checked", () => {
  it("The select all option is not checked", () => {
    render(mockCheckboxGroup);

    const checkboxInput = screen.getAllByRole("checkbox")[0];
    expect(checkboxInput.checked).toBe(false);
  });

  it("Clicking on the select all option invokes the onChange with all options", () => {
    render(mockCheckboxGroup);

    const checkboxInputs = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxInputs[0]);

    expect(mockOnChange.mock.calls[0][0]).toEqual(["option1", "option2"]);
  });

  it("Clicking on a previously unchecked option invokes the onChange properly", () => {
    render(mockCheckboxGroup);

    const checkboxInputs = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxInputs[2]);

    expect(mockOnChange.mock.calls[0][0]).toEqual(["option1", "option2"]);
  });
});
