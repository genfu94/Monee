import dayjs from "dayjs";

export function appendCustomRangePreset(presets) {
  let date_range_presets = [...presets];
  date_range_presets.push({
    presetId: "custom_range",
    label: "Custom range",
    value: [dayjs().subtract(30, "day"), dayjs()],
  });

  return date_range_presets;
}

export const renderValue = (preset, date_range_presets, dateFrom, dateTo) => {
  if (preset !== "custom_range") {
    return date_range_presets.find((item) => item.presetId === preset).label;
  }

  return `${dateFrom.format("DD-MM-YYYY")} - ${dateTo.format("DD-MM-YYYY")}`;
};