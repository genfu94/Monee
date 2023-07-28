import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DatetimePicker(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker {...props} size="small" />
    </LocalizationProvider>
  );
}
