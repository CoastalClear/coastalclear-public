import { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function BeachCalendar({ onChange, date, modalOpened }) {
  return (
    <div
      className={
        modalOpened ? "calendar-container-modal-opened" : "calendar-container"
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar onChange={onChange} date={date} />
      </LocalizationProvider>
    </div>
  );
}
