import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function getLocalTime(time) {
  return dayjs(time).add(8, "hour");
}

const timeUtils = { getLocalTime };
export default timeUtils;
