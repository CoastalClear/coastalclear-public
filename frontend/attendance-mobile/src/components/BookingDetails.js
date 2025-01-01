import React from "react";
import dayjs from "dayjs";

export default function BookingDetails({ booking }) {
  return (
    <div>
      <p className="text-xl">
        You are helping to clean up{" "}
        <span className="text-[#3B88D0]">{booking?.location?.name} </span> on{" "}
        <span className="text-[#3B88D0]">
          {dayjs(booking?.date).format("DD MMMM YYYY")}
        </span>{" "}
        from{" "}
        <span className="text-[#3B88D0]">
          {dayjs("2001-01-01 " + booking?.start_time).format("hh:mm A") +
            " to " +
            dayjs("2001-01-01 " + booking?.end_time).format("hh:mm A")}
        </span>
      </p>
    </div>
  );
}
