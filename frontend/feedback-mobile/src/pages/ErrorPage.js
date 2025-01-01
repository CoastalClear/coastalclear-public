import React from "react";
import { useBooking } from "../context/BookingContext";
import timeUtils from "../utils/timeUtils";

export default function ErrorPage({ errorState, bookingId }) {
  const { booking } = useBooking();
  function getError(error) {
    switch (error) {
      case 4:
        return (
          <p className="text-l text-[#204b73] font-semibold">
            The Booking ID you provided: {bookingId}, was not recognised
          </p>
        );
      case 3:
        return (
          <p className="text-l text-[#204b73] font-semibold">
            It is too early to provide feedback for this booking.
            <br className="h-4" />
            You can submit feedback for this booking on{" "}
            {timeUtils.getReadableDate(booking.date)} from{" "}
            {timeUtils.getReadableTime(booking.start_time)} to{" "}
            {timeUtils.getReadableTime(booking.end_time)}
          </p>
        );
      case 2:
        return (
          <p className="text-l text-[#204b73] font-semibold">
            It is too late to provide feedback for this booking.
            <div className="h-4 w-full" />
            Please inform your organiser directly if you have anymore feedback.
            <div className="h-4 w-full" />
            Thank you!
          </p>
        );
    }
  }
  return (
    <div className="flex flex-col w-full h-full items-center px-10 py-5 content-center">
      {getError(errorState)}
    </div>
  );
}
