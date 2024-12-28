import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Manage.css";
import dayjs from "dayjs";
import UpcomingActionButtons from "../components/UpcomingActionButtons";
import ConfirmCancelModal from "../components/ConfirmCancelModal";
import CompleteBookingModal from "../components/CompleteBookingModal";

import { useUser } from "../UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ModifyBookingModal from "../components/ModifyBookingModal";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function Manage() {
  const { getToken } = useUser();
  const navigate = useNavigate();
  const [upcomingBookingArr, setUpcomingBookingArr] = useState([]);
  const [pendingBookingArr, setPendingBookingArr] = useState([]);
  const [completeBookingArr, setCompleteBookingArr] = useState([]);
  const [missedBookingArr, setMissedBookingArr] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [cancelModalShow, setCancelModalShow] = useState(false);
  const [cancelledBooking, setCancelledBooking] = useState({});

  const [modifyModalShow, setModifyModalShow] = useState(false);
  const [modifyBooking, setModifyBooking] = useState({});

  const [completeModalShow, setCompleteModalShow] = useState(false);
  const [completedBooking, setCompletedBooking] = useState({});

  function sortAndDivideBookings(bookings) {
    // Current date at the beginning of the day for comparison
    const today = dayjs().startOf("day");

    // Sort bookings by date in ascending order
    bookings.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

    // Initialize arrays for past and upcoming bookings
    const newCompletedBookingArr = [];
    const newUpcomingBookingArr = [];
    const newPendingBookingArr = [];
    const newMissedBookingArr = [];

    // Divide bookings into past and upcoming based on the date comparison
    bookings.forEach((booking) => {
      if (dayjs(`${booking.date} ${booking.start_time}`).isBefore(dayjs())) {
        if (booking.status === "scheduled") {
          newPendingBookingArr.push(booking);
        } else if (booking.status === "completed") {
          newCompletedBookingArr.push(booking);
        } else if (booking.status === "missed") {
          newMissedBookingArr.push(booking);
        }
      } else {
        newUpcomingBookingArr.push(booking);
      }
    });

    setPendingBookingArr(newPendingBookingArr);
    setCompleteBookingArr(newCompletedBookingArr);
    setMissedBookingArr(newMissedBookingArr);
    setUpcomingBookingArr(newUpcomingBookingArr);
  }

  function handleCloseSnack() {
    setOpenSnack(false);
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API + "api/bookings", {
        method: "GET",
        headers: {
          Authorization: getToken(),
        },
      });
      const data = await response.json();
      sortAndDivideBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  function modifyBookingModalDidDismiss() {
    fetchBookings();
    setModifyModalShow(false);
  }

  useEffect(() => {
    fetchBookings();
  }, [getToken]);
  function onClickCancel(booking) {
    setCancelledBooking(booking);
    setCancelModalShow(true);
  }

  function onClickModify(booking) {
    setModifyBooking(booking);
    setModifyModalShow(true);
  }

  function onClickValidate(booking) {
    setCompletedBooking(booking);
    setCompleteModalShow(true);
  }

  async function onConfirmCancel(toBeCancelled) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API + "api/bookings/" + toBeCancelled.id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: getToken(),
          },
        }
      );

      if (response.ok) {
        setOpenSnack(true);
      }
    } catch (error) {}
    setUpcomingBookingArr((booking) =>
      booking.filter((item, i) => item !== toBeCancelled)
    );
    setCancelledBooking({});
  }

  function onProceedCompletion() {
    setCompletedBooking({});
    navigate("/validate", { state: { bookingObject: completedBooking } });
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnack}
        onClose={handleCloseSnack}
        autoHideDuration={3000}
        message="Booking was deleted"
      >
        <Alert
          onClose={handleCloseSnack}
          severity="info"
          color="info"
          sx={{ width: "100%" }}
        >
          Booking was deleted
        </Alert>
      </Snackbar>
      <ConfirmCancelModal
        booking={cancelledBooking}
        show={cancelModalShow}
        setShow={setCancelModalShow}
        onConfirmCancel={onConfirmCancel}
      />
      <ModifyBookingModal
        booking={modifyBooking}
        show={modifyModalShow}
        dismissModal={modifyBookingModalDidDismiss}
      />
      <CompleteBookingModal
        booking={completedBooking}
        show={completeModalShow}
        setShow={setCompleteModalShow}
        onProceedCompletion={onProceedCompletion}
      />
      <div className="manage-container">
        <div className="manage-heading">
          <h1 className="font-medium text-5xl">Manage Bookings</h1>
        </div>
        <Tabs
          defaultActiveKey="upcoming"
          id="uncontrolled-tab-example"
          className="mt-4 text-xl font-manrope "
        >
          <Tab eventKey="upcoming" title="Upcoming and Pending Bookings">
            <div className="upcoming-container">
              <div className="upcoming-bookings">
                <h3
                  style={{
                    fontSize: "25px",
                    color: "gray",
                    borderBottom: "3px solid #00000020",
                    paddingBottom: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Upcoming Bookings
                </h3>
              </div>
              <div className="max-h-[45%] overflow-y-scroll">
                <Table id="upcoming-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Location</th>
                      <th style={{ width: "10%" }}>Date</th>
                      <th style={{ width: "20%" }}>Time</th>
                      <th style={{ width: "15%" }}>{"Est. Volunteers"}</th>
                      <th style={{ width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookingArr.map((booking, index) => (
                      <>
                        <tr className="upcoming-booking-row">
                          <td>{booking.location.name}</td>
                          <td>{dayjs(booking.date).format("DD-MMM-YYYY")}</td>
                          <td>
                            {dayjs("2021-01-01 " + booking.start_time).format(
                              "hh:mm A"
                            ) +
                              " - " +
                              dayjs("2021-01-01 " + booking.end_time).format(
                                "hh:mm A"
                              )}
                          </td>
                          <td>{booking.est_volunteers}</td>
                          <td className="col-1">
                            <UpcomingActionButtons
                              booking={booking}
                              validateClicked={(e) => onClickValidate(booking)}
                              cancelClicked={(e) => onClickCancel(booking)}
                              modifyClicked={(e) => onClickModify(booking)}
                            />
                          </td>
                        </tr>
                        {index !== upcomingBookingArr.length - 1 && (
                          <tr
                            style={{
                              height: "12px",
                              background: "transparent",
                              border: "none",
                            }}
                          >
                            <td colSpan="5" style={{ padding: "0" }}></td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="upcoming-container">
              <div className="upcoming-bookings">
                <h3
                  style={{
                    fontSize: "25px",
                    color: "gray",
                    borderBottom: "3px solid #00000020",
                    paddingBottom: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Pending Bookings
                </h3>
              </div>
              <div className="max-h-[45%] overflow-y-scroll">
                <Table id="upcoming-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Location</th>
                      <th style={{ width: "10%" }}>Date</th>
                      <th style={{ width: "20%" }}>Time</th>
                      <th style={{ width: "15%" }}>Volunteers</th>
                      <th style={{ width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookingArr.map((booking, index) => {
                      return (
                        <>
                          <tr className="upcoming-booking-row">
                            <td>{booking.location.name}</td>
                            <td>{dayjs(booking.date).format("DD-MMM-YYYY")}</td>
                            <td>
                              {dayjs("2021-01-01 " + booking.start_time).format(
                                "hh:mm A"
                              ) +
                                " - " +
                                dayjs("2021-01-01 " + booking.end_time).format(
                                  "hh:mm A"
                                )}
                            </td>
                            <td>{booking.num_volunteers}</td>
                            <td>
                              <UpcomingActionButtons
                                booking={booking}
                                validateClicked={(e) =>
                                  onClickValidate(booking)
                                }
                              />
                            </td>
                          </tr>
                          {index !== pendingBookingArr.length - 1 && (
                            <tr
                              style={{
                                height: "12px",
                                background: "transparent",
                                border: "none",
                              }}
                            >
                              <td colSpan="5" style={{ padding: "0" }}></td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Tab>
          <Tab eventKey="completed" title="Past Bookings">
            <div className="upcoming-container">
              <div className="upcoming-bookings">
                <h3
                  style={{
                    fontSize: "25px",
                    color: "gray",
                    borderBottom: "3px solid #00000020",
                    paddingBottom: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Completed Bookings
                </h3>
              </div>
              <div className="max-h-[45%] overflow-y-scroll">
                <Table id="upcoming-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Location</th>
                      <th style={{ width: "10%" }}>Date</th>
                      <th style={{ width: "20%" }}>Time</th>
                      <th style={{ width: "15%" }}>Volunteers</th>
                      <th style={{ width: "10%" }}>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completeBookingArr.map((booking, index) => {
                      return (
                        <>
                          <tr className="upcoming-booking-row">
                            <td>{booking.location.name}</td>
                            <td>{dayjs(booking.date).format("DD-MMM-YYYY")}</td>
                            <td>
                              {dayjs("2021-01-01 " + booking.start_time).format(
                                "hh:mm A"
                              ) +
                                " - " +
                                dayjs("2021-01-01 " + booking.end_time).format(
                                  "hh:mm A"
                                )}
                            </td>
                            <td>{booking.num_volunteers}</td>
                            <td>
                              {booking.collected_weight
                                ? booking.collected_weight + " kg"
                                : "Unreported"}
                            </td>
                          </tr>
                          {index !== completeBookingArr.length - 1 && (
                            <tr
                              style={{
                                height: "12px",
                                background: "transparent",
                                border: "none",
                              }}
                            >
                              <td colSpan="5" style={{ padding: "0" }}></td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <div className="upcoming-container">
                <div className="upcoming-bookings">
                  <h3
                    style={{
                      fontSize: "25px",
                      color: "gray",
                      borderBottom: "3px solid #00000020",
                      paddingBottom: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    Missed Bookings
                  </h3>
                </div>
                <div className="max-h-[45%] overflow-y-scroll">
                  <Table id="upcoming-table">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>Location</th>
                        <th style={{ width: "10%" }}>Date</th>
                        <th style={{ width: "20%" }}>Time</th>
                        <th style={{ width: "15%" }}>Est. Volunteers</th>
                        <th style={{ width: "10%" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {missedBookingArr.map((booking, index) => {
                        return (
                          <>
                            <tr className="upcoming-booking-row">
                              <td>{booking.location.name}</td>
                              <td>
                                {dayjs(booking.date).format("DD-MMM-YYYY")}
                              </td>
                              <td>
                                {dayjs(
                                  "2021-01-01 " + booking.start_time
                                ).format("hh:mm A") +
                                  " - " +
                                  dayjs(
                                    "2021-01-01 " + booking.end_time
                                  ).format("hh:mm A")}
                              </td>
                              <td>{booking.est_volunteers}</td>
                            </tr>
                            {index !== missedBookingArr.length - 1 && (
                              <tr
                                style={{
                                  height: "12px",
                                  background: "transparent",
                                  border: "none",
                                }}
                              >
                                <td colSpan="5" style={{ padding: "0" }}></td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
