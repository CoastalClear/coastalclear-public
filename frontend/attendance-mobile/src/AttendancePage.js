import BookingDetails from "./components/BookingDetails";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import GuyHoldingBroom from "./assets/guy-hold-broom.png";
import Spinner from "react-bootstrap/Spinner";
import HowToRegIcon from "@mui/icons-material/HowToReg";

function AttendancePage() {
  const [booking, setBooking] = useState();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { bookingId } = useParams();

  async function fetchBooking(bookingId) {
    const response = await fetch(
      process.env.REACT_APP_API + `api/bookings/public/${bookingId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (response.ok) {
      response.json().then((data) => {
        setBooking(data);
        setLoading(false);
      });
    }
  }

  async function postAttendance(bookingId) {
    const response = await fetch(
      process.env.REACT_APP_API + `api/bookings/${bookingId}/attendance`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      setLoading(false);
      setCompleted(true);
    }
  }

  useEffect(() => {
    fetchBooking(bookingId);
  }, []);

  function buttonClick() {
    setCompleted(true);
    setLoading(true);
    postAttendance(bookingId);
  }

  return !loading ? (
    !completed ? (
      <div className="flex flex-col w-screen h-screen py-4 px-4 items-center relative">
        <BookingDetails booking={booking} />
        <img src={GuyHoldingBroom} className="w-[180px] h-[200px] my-9" />
        <p className="absolute bottom-[170px]">
          Please only Submit Your Attendance once!
        </p>
        <Button
          className="absolute h-14 bottom-[100px] flex justify-center items-center"
          style={{ backgroundColor: "#0D3B66", border: "none" }}
          onClick={buttonClick}
        >
          Submit Your Attendance
        </Button>
      </div>
    ) : (
      <div className="flex flex-col w-screen px-4 py-5 items-center relative text-2xl">
        <h1 className="bg-[#E5FFEA] text-[#1D802D] ml-auto mr-auto px-7 py-3 text-lg rounded-full">
          <HowToRegIcon className="mr-4" />
          Attendance Submitted
        </h1>
        <p className="text-[#3B88D0] text-[100px] h-[100px] flex items-center mt-5">{`${
          booking.attendance + 1
        }`}</p>
        <p className="mb-[150px]">people have checked in.</p>
        <p className="">Welcome to the party!</p>
        <p className="">You can now close this page.</p>
      </div>
    )
  ) : (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <Spinner
        animation="border"
        role="status"
        style={{ width: "100px", height: "100px" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default AttendancePage;
