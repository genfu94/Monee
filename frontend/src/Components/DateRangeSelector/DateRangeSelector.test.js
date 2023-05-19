import dayjs from "dayjs";
import { render, screen, getByTestId } from "@testing-library/react";
import DateRangeSelector from "./DateRangeSelector";
import DropDownBase from "../DropDownBase/DropDownBase";

const mockChildComponent = jest.fn();
jest.mock("../DropDownBase/DropDownBase", () => (props) => {
  mockChildComponent(props);
  return <mock-childComponent>
    <button test-dataid="presetSelector">Select</button>
  </mock-childComponent>;
});

describe("When a preset is clicked", () => {
  it("", () => {
    const { container } = render(
      <DateRangeSelector
        value={[null, null]}
        preset="last_7_days"
        onChange={() => {}}
        presets={[
          {
            presetId: "last_7_days",
            label: "Last 7 days",
            value: [null, null],
          },
        ]}
      />
    );
    expect(mockChildComponent).toHaveBeenCalled();
    screen.findAllByTestId("presetSelector");

    /*expect(mockChildComponent).toHaveBeenCalledWith(
    expect.objectContaining({
      open: true,
      data: "some data",
    })
  );*/
  });
});
