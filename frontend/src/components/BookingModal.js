import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import "./BookingModal.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useFormik } from "formik";
import Alert from "@mui/material/Alert";
import { Table } from "react-bootstrap";
import PeopleIcon from "./PeopleIcon";
import { useUser } from "../UserContext";
import confirmPic from "..//booking-confirmed-pic.png";
import FeedbackAndAttendanceCard from "./FeedbackAndAttendanceCard";

function BookingModal({
  show,
  setShow,
  navigation,
  feature,
  bookingsArr,
  date,
}) {
  const { getToken, getEmail } = useUser();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState({});
  const formik = useFormik({
    initialValues: {
      startTime: null,
      endTime: null,
      volunteers: null,
    },
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
        date: dayjs(date).format("YYYY-MM-DD"),
        start_time: dayjs(values.startTime).format("HH:mm"),
        end_time: dayjs(values.endTime).format("HH:mm"),
        location_id: feature.id,
        est_volunteers: values.volunteers,
        num_volunteers: 0,
        name: feature.name,
      };
      const response = await fetch(process.env.REACT_APP_API + "api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        body: JSON.stringify(submittedValues),
      });

      if (response.ok) {
        let data = await response.json();
        setShowConfirmation(true);
        setConfirmedDetails(data);
      }
    },
  });

  function didClickCancel() {
    formik.resetForm();
    setShow(false);
  }

  function didClickDone() {
    setShow(false);
    setShowConfirmation(false);
    formik.resetForm();
  }

  if (showConfirmation) {
    return (
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="fullscreen-modal" // Custom class for styling
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="confirmation-modal-container">
          <h1 className="bg-[#E5FFEA] text-[#1D802D] ml-auto mr-auto mb-1 px-7 py-3 text-2xl rounded-full">
            <EventAvailableIcon className="mr-4" />
            Booking Confirmed!
          </h1>
          <div className="flex justify-center w-1/2 mb-7">
            <div className="flex-1">
              <img
                style={{ width: "250px", height: "320px" }}
                src={confirmPic}
                alt="fireSpot"
              />
            </div>
            <div className="flex flex-1 text-2xl text-start ml-12 leading-10 items-center">
              <t>
                {"You are visiting "}
                <span className="bmodal-para-special-words">
                  {confirmedDetails?.location?.name}
                </span>
                {" on the "}
                <span className="bmodal-para-special-words">
                  {dayjs(confirmedDetails.date).format("DD MMMM YYYY")}
                </span>
                {" from "}
                <span className="bmodal-para-special-words">
                  {dayjs("2000-01-01 " + confirmedDetails.start_time).format(
                    "hh:mm A"
                  ) +
                    " to " +
                    dayjs("2000-01-01 " + confirmedDetails.end_time).format(
                      "hh:mm A"
                    )}
                </span>
                {" with "}
                <span className="bmodal-para-special-words">
                  {confirmedDetails.est_volunteers + " volunteers"}
                </span>
              </t>
            </div>
          </div>
          {/* <BookingConfirmCard /> */}
          <FeedbackAndAttendanceCard booking={confirmedDetails} />
          <div className="bmodal-button-row">
            <Button
              className="bmodal-button bmodal-button-submit"
              variant="primary"
              type="submit"
              onClick={() => navigation("/manage")}
            >
              View My Bookings
            </Button>
            <div
              style={{
                width: "45%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: "300px",
              }}
            >
              <t
                style={{
                  fontSize: "25px",
                  marginBottom: "5px",
                  borderBottom: "2px solid #0D3B66",
                  color: "#0D3B66",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  formik.resetForm();
                  setConfirmedDetails({});
                  setShowConfirmation(false);
                  setShow(false);
                }}
              >
                Go Back To Map
              </t>
            </div>
          </div>
        </div>
      </Modal>
    );
  } else {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="fullscreen-modal" // Custom class for styling
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="booking-modal-container">
            <div className="booking-title-row">
              <h1
                style={{
                  fontSize: "38px",
                  fontWeight: "500",
                  marginRight: "50px",
                }}
              >
                {feature?.name}
              </h1>
              <h2
                style={{
                  fontSize: "38px",
                  fontWeight: "500",
                  color: "#3B88D0",
                }}
              >
                {dayjs(date).format("MMMM DD")}
              </h2>
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
                    {feature?.name}
                  </text>
                </div>
                <div className="bmodal-confirm-details-individual">
                  <text>Date:</text>
                  <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                    {dayjs(date).format("DD MMMM YYYY")}
                  </text>
                </div>
              </div>
            </div>
            <Form
              onSubmit={formik.handleSubmit}
              className="bmodal-details-form"
            >
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
                    onChange={(value) =>
                      formik.setFieldValue("startTime", value)
                    }
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
                    <th>Weight</th>
                    <th></th>
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
                          <td className="col-1"></td>
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
                  onClick={didClickCancel}
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
}

export default BookingModal;
