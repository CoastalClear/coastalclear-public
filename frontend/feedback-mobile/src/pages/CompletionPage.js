import React from "react";
import GuyHoldBroom from "../assets/guy-hold-broom.png";
import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

export default function CompletionPage() {
  const { booking } = useBooking();
  const navigate = useNavigate();

  function didClickSubmitAnother() {
    if (!booking.id) {
      return;
    }
    navigate(`/${booking.id}`);
  }
  return (
    <div className="flex flex-col w-full h-full py-4 px-10 content-around">
      <p className="text-xl text-[#204b73] font-semibold mb-0">
        Thanks for letting us know!
      </p>
      <p className="text-m text-[#204b73] font-semibold">
        We'll make sure the right people are informed.
      </p>
      <img src={GuyHoldBroom} />
      <button
        onClick={didClickSubmitAnother}
        className="mt-4 w-full py-2 text-sm rounded-md bg-[#204b73] text-white border border-gray-800 basis-1/2"
      >
        <p className="text-xl mb-0">Submit another feedback</p>
      </button>
    </div>
  );
}
