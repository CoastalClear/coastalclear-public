import React from "react";
import mainLogo from "../coastal-clear-logo.png";

export default function TopNav() {
  return (
    <div className="w-full h-16 bg-[#0D3B66] text-white flex items-center ">
      <img className="m-auto h-10" src={mainLogo} alt="fireSpot" />
    </div>
  );
}
