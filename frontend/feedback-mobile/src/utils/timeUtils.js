import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

function isTooEarly(date, start_time, offset) {
  // Combine the date and time into a single dayjs object
  let eventStart = dayjs(`${date} ${start_time}`, "YYYY-MM-DD HH:mm");
  eventStart = eventStart.subtract(offset, "hour");

  // Get the current dayjs object
  const now = dayjs();

  // Return true if the current time is before the event start time
  return now.isBefore(eventStart);
}

function isTooLate(date, end_time, offset) {
  let endTime = dayjs(`${date} ${end_time}`, "YYYY-MM-DD HH:mm");
  endTime = endTime.add(offset, "hour");

  // Get the current dayjs object
  const now = dayjs();

  // Return true if the current time is before the event start time
  return now.isAfter(endTime);
}

function getXHoursBefore(time, x) {
  const now = dayjs(); // Current time
  const today = now.format("YYYY-MM-DD"); // Today's date in YYYY-MM-DD format
  const parsedTime = dayjs(`${today} ${time}`, "YYYY-MM-DD HH:mm");

  return parsedTime.subtract(x, "hour").format("HH:mm");
}

function getXHoursAfter(time, x) {
  const now = dayjs(); // Current time
  const today = now.format("YYYY-MM-DD"); // Today's date in YYYY-MM-DD format
  const parsedTime = dayjs(`${today} ${time}`, "YYYY-MM-DD HH:mm");

  return parsedTime.add(x, "hours").format("HH:mm");
}

function isWithinTimeRange(start_time, end_time) {
  const now = dayjs(); // Current time
  const today = now.format("YYYY-MM-DD"); // Today's date in YYYY-MM-DD format

  // Parse start and end times with today's date to ensure comparison happens on the same day
  const startTime = dayjs(`${today} ${start_time}`, "YYYY-MM-DD HH:mm");
  const endTime = dayjs(`${today} ${end_time}`, "YYYY-MM-DD HH:mm");

  // Calculate adjusted times
  const adjustedStartTime = startTime.subtract(1, "hour");
  const adjustedEndTime = endTime.add(3, "hours");

  // Check if current time is within the adjusted time range
  const isWithinRange =
    now.isAfter(adjustedStartTime) && now.isBefore(adjustedEndTime);

  return isWithinRange;
}

function isToday(dateString) {
  return dayjs().isSame(dateString, "day");
}

function getReadableDate(input_date) {
  return dayjs(input_date).format("DD MMMM YYYY");
}

function getReadableTime(input_time) {
  // Parse the input time and then format it to a more readable form
  return dayjs(input_time, "HH:mm").format("h:mm A");
}

const timeUtils = {
  isTooEarly,
  isTooLate,
  isWithinTimeRange,
  isToday,
  getReadableDate,
  getReadableTime,
  getXHoursAfter,
  getXHoursBefore,
};

export default timeUtils;
