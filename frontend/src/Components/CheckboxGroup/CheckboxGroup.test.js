import CheckboxGroup from "./CheckboxGroup";
import {render, screen, fireEvent} from "@testing-library/react";

const mockOnChange = jest.fn();
const mockCheckboxGroup = (
  <CheckboxGroup options={[
    {
      "label": "Option 1",
      "value": "option1"
    },
    {
      "label": "Option 2",
      "value": "option2"
    }
  ]}
  value={["option1"]}
  onChange={mockOnChange}
  />
);

describe("When a checkbox become checked", () => {
  it("Invokes the onChange method with the new value included", () => {
    render(mockCheckboxGroup);

    const checkboxInput = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkboxInput);
    expect(mockOnChange.mock.calls[0][0]).toEqual(['option1', 'option2']);
  });
})

describe("When a checkbox become unchecked", () => {
  it("Invokes the onChange method with the value removed", () => {
    render(mockCheckboxGroup);

    const checkboxInput = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkboxInput);
    expect(mockOnChange.mock.calls[0][0]).toEqual([]);
  });
})
