import { render, screen, findByText, fireEvent, getByRole } from "@testing-library/react";
import DropDownBase from "./DropDownBase";
import "@testing-library/jest-dom";

const options = [
  {
    value: "value1",
    label: "label1",
  },
  {
    value: "value2",
    label: "label2",
  },
];

const mockOnOpen = jest.fn();
const mockOnClose = jest.fn();
const renderValue = (v) => options.find((e) => e.value == v).label;

const mockDropDownBaseOpen = (
  <DropDownBase
    value={options[0].value}
    onOpen={mockOnOpen}
    onClose={mockOnClose}
    open={true}
    renderValue={renderValue}
  >
    <div data-testid="content">Content</div>
  </DropDownBase>
);

const mockDropDownBaseClose = (
  <DropDownBase
    value={options[0].value}
    onOpen={mockOnOpen}
    onClose={mockOnClose}
    open={false}
    renderValue={renderValue}
  >
    <div data-testid="content">Content</div>
  </DropDownBase>
);

it("Renders the selected value correctly", async () => {
  render(mockDropDownBaseClose);

  const dropdownButton = screen.getByTestId("dropdown-button");
  expect(await findByText(dropdownButton, options[0].label)).toBeVisible();
});

describe("When the dropdown is open", () => {
  it("shows the content", () => {
    render(mockDropDownBaseOpen);

    expect(screen.getByTestId("content")).toBeVisible();
  });

  it("invokes the onClose callback if button click", () => {
    render(mockDropDownBaseOpen);

    const dropdownButton = screen.getByTestId("dropdown-button");
    fireEvent.click(dropdownButton);
    expect(mockOnClose).toBeCalled();
  });
});

describe("When the dropdown is closed", () => {
  it("hides the content", () => {
    render(mockDropDownBaseClose);

    expect(screen.queryByTestId("content")).toBe(null);
  });

  it("invokes the onOpen callback if button click", () => {
    render(mockDropDownBaseClose);

    const dropdownButton = screen.getByTestId("dropdown-button");
    fireEvent.click(dropdownButton);
    expect(mockOnOpen).toBeCalled();
  });
});
