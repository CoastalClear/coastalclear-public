import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import LoadingScreen from "../components/LoadingScreen";

import ReportingPage from "./ReportingPage";
import ErrorPage from "./ErrorPage";
import timeUtils from "../utils/timeUtils";
import { useBooking } from "../context/BookingContext";

export default function RootPage() {
  const { booking, setBooking } = useBooking();
  const { bookingId } = useParams();
  const [currState, setCurrState] = useState(0); //unverified
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (bookingId === "demo") {
      setCurrState(1);
      setBooking({
        location: { name: "Sample Booking Location" },
        start_time: "18:00",
        end_time: "19:00",
      });
      return;
    }
    async function assignState() {
      api
        .fetchBookingFromId(bookingId)
        .then((resp) => resp.json())
        .then((data) => parseData(data))
        .catch((err) => console.error(err));
    }
    setTimeout(() => {
      assignState();
    }, 1000);
  }, [bookingId]);

  function parseData(dataObject) {
    const { id, date, start_time, end_time } = dataObject;
    if (!id) {
      return setCurrState(4);
    }

    setBooking(dataObject);

    if (timeUtils.isTooEarly(date, start_time, 1)) {
      return setCurrState(3);
    } else if (timeUtils.isTooLate(date, end_time, 3)) {
      return setCurrState(2);
    } else {
      setProgress(100);
      setTimeout(() => setCurrState(1), 1000);
      return;
    }
  }

  switch (currState) {
    case 0:
      return <LoadingScreen progress={progress} setProgress={setProgress} />;
    case 1: // completed
      return <ReportingPage />;
    default: // not a valid booking Id
      return <ErrorPage errorState={currState} bookingId={bookingId} />;
  }
}
