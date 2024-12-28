import React, { useState } from "react";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import QRCode from "qrcode.react";

export default function FeedbackAndAttendanceCard({ booking }) {
  const [copied, setCopied] = useState(false);
  console.log(booking);
  return (
    <>
      <div className="w-full h-[500] flex mb-4">
        <div className="flex-1 items-center bg-[#3B88D020] mr-5 py-3 px-4 rounded-xl">
          <p className="text-2xl mb-1">Feedback</p>
          <p className="mb-3">
            Pass on the link below to your cleanup volunteers. So they can share
            anything useful with future cleanup organisers
          </p>
          <p
            onClick={() => {
              navigator.clipboard.writeText(
                `https://feedback.coastalclear.org/${booking.id}`
              );
              setCopied(true);
            }}
            className="cursor-pointer hover:bg-[#3B88D030] py-1 px-2 "
          >
            {copied ? (
              <DoneOutlinedIcon className="mr-4" />
            ) : (
              <ContentPasteOutlinedIcon className="mr-4" />
            )}
            {`https://feedback.coastalclear.org/${booking.id}`}
          </p>
        </div>
        <div className="flex-1 items-center bg-[#3B88D020] py-3 px-4 rounded-xl">
          <p className="text-2xl mb-1">Attendance</p>
          <p className="mb-3">
            Let your volunteers scan this QR Code for attendance
          </p>
          <QRCode
            value={`https://attendance.coastalclear.org/${booking.id}`}
            size={200}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>
      </div>
    </>
  );
}
