import React from "react";
import { useBooking } from "../context/BookingContext";
import timeUtils from "../utils/timeUtils";
import dayjs from "dayjs";

export default function BookingTitle() {
  const { booking } = useBooking();
  return (
    booking && (
      <div className="w-full h-36">
        <p className="mb-0 text-l">
          You are sharing feedback for{" "}
          <span className="text-blue-600">{booking.location.name}.</span>
        </p>
        <p>
          You will be able to share your feedback from
          <span className="text-blue-600">
            {" "}
            {dayjs(
              "2001-01-01 " + timeUtils.getXHoursBefore(booking.start_time, 1)
            ).format("hh:mm A")}{" "}
          </span>
          to
          <span className="text-blue-600">
            {" "}
            {dayjs(
              "2001-01-01 " + timeUtils.getXHoursAfter(booking.end_time, 3)
            ).format("hh:mm A")}{" "}
          </span>
        </p>
      </div>
    )
  );
}
