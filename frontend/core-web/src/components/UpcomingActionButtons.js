import React from "react";
import { OverlayTrigger } from "react-bootstrap";
import dayjs from "dayjs";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { SvgIcon } from "@mui/material";
import Tooltip from "react-bootstrap/Tooltip";

export default function UpcomingActionButtons({
  booking,
  cancelClicked,
  modifyClicked,
  validateClicked,
}) {
  // 0: upcoming 1: pending 2: completed 3:missed
  const bookingStatus = checkDate(booking);

  function checkDate(booking) {
    if (!booking) {
      return -1;
    }

    // Check if the input date is today or in the future
    if (dayjs(`${booking.date} ${booking.start_time}`).isAfter(dayjs())) {
      // return "Future or today";
      return 0;
    } else {
      // return "Past";
      switch (booking.status) {
        case "scheduled":
          return 1;
        case "completed":
          return 2;
        default:
          return 3;
      }
    }
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: "35px",
      }}
    >
      {(bookingStatus === 0 || bookingStatus === 2 || bookingStatus === 3) && (
        <>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="button-tooltip-2">Delete Upcoming Booking</Tooltip>
            }
          >
            {({ ref, ...triggerHandler }) => (
              <DeleteOutlineOutlinedIcon
                {...triggerHandler}
                style={{
                  color: "#828282",
                  fontSize: "24px",
                  marginRight: "12px",
                  cursor: "pointer",
                }}
                ref={ref}
                onClick={cancelClicked}
              />
            )}
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="button-tooltip-2">Modify Upcoming Booking</Tooltip>
            }
          >
            {({ ref, ...triggerHandler }) => (
              <EditOutlinedIcon
                {...triggerHandler}
                style={{
                  color: "#828282",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                ref={ref}
                onClick={modifyClicked}
              />
            )}
          </OverlayTrigger>
        </>
      )}
      {bookingStatus === 1 && (
        <div
          style={{
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3B88D0",
            paddingTop: "3px",
            paddingBottom: "3px",
            color: "white",
            paddingRight: "20px",
            paddingLeft: "20px",
            borderRadius: "15px",
            cursor: "pointer",
          }}
          onClick={validateClicked}
        >
          <SvgIcon style={{ height: "16px", marginRight: "8px" }}>
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.42491 16.5938H13.0562C13.459 16.5938 13.8453 16.4338 14.1301 16.149C14.415 15.8642 14.575 15.4779 14.575 15.0751V5.20315L10.7781 1.40625H3.94366C3.54086 1.40625 3.15456 1.56626 2.86974 1.85108C2.58492 2.13591 2.42491 2.52221 2.42491 2.92501V5.96252M10.0187 1.40625V4.44377C10.0187 4.84657 10.1787 5.23287 10.4635 5.51769C10.7484 5.80251 11.1347 5.96252 11.5375 5.96252H14.575M1.66553 11.2782L3.18429 12.7969L6.2218 9.75942"
                stroke="white"
                strokeWidth="1.51876"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </SvgIcon>
          Complete
        </div>
      )}
    </div>
  );
}
