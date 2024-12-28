import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import dayjs from "dayjs";
import "./ModifyBookingModal.css";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../UserContext";
import { useLocation } from "../LocationsContext";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import Alert from "@mui/material/Alert";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Table } from "react-bootstrap";
import PeopleIcon from "./PeopleIcon";
import api from "../utility/api";
import FeedbackAndAttendanceCard from "./FeedbackAndAttendanceCard";

export default function ModifyBookingModal({ booking, show, dismissModal }) {
  const { getToken, getEmail } = useUser();
  const [bookingsArr, setBookingsArr] = useState([]);
  const [times, setTimes] = useState({});

  useEffect(() => {
    if (!show) return;
    setTimes({
      start_time: dayjs("2000-01-01" + booking.start_time),
      end_time: dayjs("2000-01-01" + booking.end_time),
    });
    setBookingsArr([]);
    getRelevantBookings(booking);
  }, [show]);

  function sortDatesAscending(bookingList) {
    return bookingList.sort((a, b) => {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Compare the two dates
      return dateA - dateB;
    });
  }

  function findDatesWithinRange(currBooking, bookings) {
    let inputDate = currBooking?.date;
    if (!bookings) return [];

    const targetDate = new Date(inputDate);
    const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

    setBookingsArr(
      sortDatesAscending(
        bookings.filter((checkBooking) => {
          const currentDate = new Date(checkBooking.date);
          // Calculate the absolute difference in milliseconds
          const diff = Math.abs(currentDate - targetDate);
          // Check if the difference is less than or equal to 3 days
          return checkBooking.id !== currBooking.id && diff <= threeDays;
        })
      )
    );
  }

  async function getRelevantBookings(currBooking) {
    const response = await api
      .querySpecificLocation(currBooking.location_id, dayjs(currBooking.date))
      .catch((err) => {
        console.error(err);
      });

    findDatesWithinRange(currBooking, response.bookings);
  }

  const formik = useFormik({
    initialValues: {
      startTime: times.start_time,
      endTime: times.end_time,
      volunteers: booking.est_volunteers,
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};

      // Check for empty fields
      if (!values.startTime) {
        errors.startTime = "Start time is required";
      }
      if (!values.endTime) {
        errors.endTime = "End time is required";
      }
      if (!values.volunteers) {
        errors.volunteers = "Please select the number of volunteers";
      }

      // Check if end time is after start time
      if (
        values.startTime &&
        values.endTime &&
        values.endTime.isBefore(values.startTime)
      ) {
        errors.endTime = "End time must be after start time";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const submittedValues = {
        date: dayjs(booking?.date).format("YYYY-MM-DD"),
        start_time: dayjs(values.startTime).format("HH:mm"),
        end_time: dayjs(values.endTime).format("HH:mm"),
        est_volunteers: values.volunteers,
        num_volunteers: 0,
        status: "pending",
        collected_weight: 0,
      };
      const response = await fetch(
        process.env.REACT_APP_API + "api/bookings/" + booking.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
          body: JSON.stringify(submittedValues),
        }
      );

      if (response.ok) {
        let data = await response.json();
        dismissModal();
      }
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal
        show={show}
        onHide={dismissModal}
        dialogClassName="fullscreen-modal" // Custom class for styling
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="modify-modal-container">
          <CloseIcon
            style={{
              height: "40px ",
              width: "40px",
              position: "absolute",
              right: "60px",
              top: "60px",
              cursor: "pointer",
            }}
            onClick={() => dismissModal()}
          />
          <div className="modify-modal-top-row">
            <h1>{booking?.location?.name}</h1>
            <h1 style={{ marginLeft: "38px", color: "#3B88D0" }}>
              {dayjs(booking?.date).format("DD MMMM")}
            </h1>
          </div>
          <div className="validate-booking-details-container">
            <h2
              style={{
                width: "100%",
                borderBottom: "3px solid #00000020",
                paddingBottom: "1%",
                fontSize: "22px",
              }}
            >
              Your Booking Details
            </h2>
            <div className="validate-booking-details">
              <div className="bmodal-confirm-details-individual">
                <text>Email:</text>
                <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                  {getEmail()}
                </text>
              </div>
              <div className="bmodal-confirm-details-individual">
                <text>Location:</text>
                <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                  {booking?.location?.name}
                </text>
              </div>
              <div className="bmodal-confirm-details-individual">
                <text>Date:</text>
                <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                  {dayjs(booking?.date).format("DD MMMM YYYY")}
                </text>
              </div>
            </div>
          </div>
          <Form onSubmit={formik.handleSubmit} className="bmodal-details-form">
            <div className="bmodal-details-form-field-container">
              <Form.Group className="bmodal-details-form-field">
                <Form.Label>Number Of Volunteers</Form.Label>
                <Form.Select
                  onChange={formik.handleChange}
                  value={formik.values.volunteers}
                  name="volunteers"
                >
                  <option value={null}>{"Select a range"}</option>
                  <option>{"<10"}</option>
                  <option>{"10-20"}</option>
                  <option>{"20-50"}</option>
                  <option>{">50"}</option>
                </Form.Select>
                {formik.touched.volunteers && formik.errors.volunteers && (
                  <div style={{ marginTop: "10px" }}>
                    <Alert severity="error">{formik.errors.volunteers}</Alert>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="bmodal-details-form-field">
                <Form.Label>Start Time</Form.Label>
                <DesktopTimePicker
                  value={formik.values.startTime}
                  onChange={(value) => formik.setFieldValue("startTime", value)}
                  onBlur={() => formik.setFieldTouched("startTime")}
                />
                {formik.touched.startTime && formik.errors.startTime && (
                  <div style={{ marginTop: "10px" }}>
                    <Alert severity="error">{formik.errors.startTime}</Alert>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="bmodal-details-form-field">
                <Form.Label>End Time</Form.Label>
                <DesktopTimePicker
                  value={formik.values.endTime}
                  onChange={(value) => formik.setFieldValue("endTime", value)}
                  onBlur={() => formik.setFieldTouched("endTime")}
                />
                {formik.touched.endTime && formik.errors.endTime && (
                  <div style={{ marginTop: "10px" }}>
                    <Alert severity="error">{formik.errors.endTime}</Alert>
                  </div>
                )}
              </Form.Group>
            </div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 400,
                width: "100%",
              }}
            >
              Upcoming and Past Bookings
            </h1>
            <text
              style={{
                color: "#00000090",
                fontSize: "12px",
                marginBottom: "05px",
                borderBottom: "2px solid #00000020",
                width: "100%",
                paddingBottom: "9px",
              }}
            >
              Showing +/- 3 Days
            </text>
            <Table id="upcoming-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Volunteers</th>
                </tr>
              </thead>
              <tbody>
                {bookingsArr.map((booking, index) => {
                  return (
                    <>
                      <tr className="upcoming-booking-row">
                        <td>{dayjs(booking.date).format("DD-MMM")}</td>
                        <td>
                          {dayjs("2021-01-01" + booking.start_time).format(
                            "hh:mm A"
                          ) +
                            " - " +
                            dayjs("2021-01-01" + booking.end_time).format(
                              "hh:mm A"
                            )}
                        </td>
                        <td>
                          <PeopleIcon />
                          <text style={{ marginLeft: "10px" }}>50</text>
                        </td>
                      </tr>
                      {index !== bookingsArr.length - 1 && (
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
            <FeedbackAndAttendanceCard booking={booking} />
            <div style={{ flexGrow: "1" }}></div>
            <div className="bmodal-button-row">
              <Button
                className="bmodal-button bmodal-button-submit"
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
              <Button
                className="bmodal-button"
                variant="secondary"
                onClick={dismissModal}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </LocalizationProvider>
  );
}
