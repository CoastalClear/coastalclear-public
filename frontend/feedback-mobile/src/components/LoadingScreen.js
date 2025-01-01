import React, { useEffect } from "react";
import GuyHoldBroom from "../assets/guy-hold-broom.png";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function LoadingScreen({ progress, setProgress }) {
  useEffect(() => {
    function setFakeProgress() {
      if (progress === 100) {
        return;
      }
      setTimeout(() => {
        setProgress(20);
      }, 500);
      setTimeout(() => {
        setProgress(45);
      }, 2000);
      setTimeout(() => {
        setProgress(70);
      }, 3000);
      setTimeout(() => {
        setProgress(80);
      }, 5000);
    }
    setFakeProgress();
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center px-10 py-5">
      <p className="text-xl text-[#204b73] font-semibold">
        {"We are fetching your\nbooking information."}
      </p>
      <ProgressBar className="w-full h-4 mb-5" animated now={progress} />
      <img src={GuyHoldBroom} className="w-full" />
    </div>
  );
}
