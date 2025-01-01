import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";

export default function AttendanceCard({ booking }) {
  return (
    booking && (
      <Card
        sx={{
          width: "100%",
          flexShrink: "0",
          backgroundColor: "#00000010",
        }}
      >
        <CardContent className="flex flex-col">
          <t className="text-2xl text-[#5E5E5E] mb-2 font-semibold">
            <QrCodeScannerOutlinedIcon className="mr-2" />
            QR Attendance
          </t>
          <t className="text-xl text-[#5E5E5E] font-medium">
            {`${booking.attendance} people scanned the attendance QR Code for this cleanup`}
          </t>
        </CardContent>
      </Card>
    )
  );
}
