import React, { useState } from "react";
import "./Validate.css";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useUser } from "../UserContext";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import cleanupLogo from "../cleanup-complete-party.png";
import cleanupCompletePic from "../cleanup-complete-pic.png";
import AttendanceCard from "../components/AttendanceCard";
import MoreInfoPopUp from "../components/MoreInfoPopUp";

export default function Validate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCleanupComplete, setShowCleanupComplete] = useState(false);
  const [completedBooking, setCompletedBooking] = useState({});
  const { getUser, getToken } = useUser();
  const user = getUser();
  const booking = location.state?.bookingObject; // Access the booking passed in state

  const validationSchema = Yup.object({
    volunteerTurnout: Yup.number()
      .integer("Total Volunteer Turnout must be an integer")
      .required("Total Volunteer Turnout is required"),
    trashWeight: Yup.number().integer("Total Trash Weight must be an integer"),
  });

  function didClickCancel() {
    navigate("/manage");
  }

  if (showCleanupComplete) {
    return (
      <div
        className="validate-container"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          maxHeight: "800px",
          marginTop: "auto",
        }}
      >
        <h1 className="bg-[#E5FFEA] text-[#1D802D] px-7 py-4 text-4xl rounded-full flex">
          <img className="w-9 h-9 mr-3" src={cleanupLogo} alt="fireSpot" />
          Cleanup Complete!
        </h1>
        <div className="flex w-full justify-center items-center max-w-2xl">
          <img
            className="w-64 h-64 mr-14"
            src={cleanupCompletePic}
            alt="fireSpot"
          />
          <p className="text-4xl/[50px] items-center">
            Hooray! You and your team have cleaned up{" "}
            <span className="text-[#3B88D0]">
              {completedBooking.collected_weight + "kg worth of trash!"}
            </span>
          </p>
        </div>
        <t
          style={{
            fontSize: "35px",
            marginBottom: "5px",
            borderBottom: "2px solid #0D3B66",
            color: "#0D3B66",
            paddingLeft: "8px",
            paddingRight: "8px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/map");
          }}
        >
          Go Back To Map
        </t>
      </div>
    );
  } else {
    return (
      <div className="validate-container">
        <h1
          style={{
            fontSize: "45px",
            fontWeight: "500",
            color: "#3B88D0",
            marginBottom: "20px",
          }}
        >
          Complete a Cleanup
        </h1>
        <div className="validate-title-row">
          <h1
            style={{ fontSize: "60px", fontWeight: "500", marginRight: "40px" }}
          >
            {booking?.location?.name}
          </h1>
          <h2 style={{ fontSize: "60px", fontWeight: "500", color: "#3B88D0" }}>
            {dayjs(booking?.date).format("MMMM DD")}
          </h2>
        </div>
        <div className="validate-booking-details-container">
          <h2 className="w-full border-b-[#00000020] border-solid border-b-2 pb-2 mb-8">
            Your Booking Details
          </h2>
          <div className="validate-booking-details">
            <div
              style={{ width: "35%", marginBottom: "8px", minWidth: "400px" }}
            >
              <text>Email:</text>
              <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                {user?.email}
              </text>
            </div>
            <div
              style={{ width: "25%", marginBottom: "8px", minWidth: "200px" }}
            >
              <text>Booking ID:</text>
              <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                {booking.id}
              </text>
            </div>
            <div
              style={{ width: "20%", marginBottom: "8px", minWidth: "250px" }}
            >
              <text>Start Time:</text>
              <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                {dayjs("2021-01-01 " + booking.start_time).format("hh:mm A")}
              </text>
            </div>
            <div
              style={{ width: "20%", marginBottom: "8px", minWidth: "250px" }}
            >
              <text>End Time:</text>
              <text style={{ fontWeight: 1000, marginLeft: 10 }}>
                {dayjs("2021-01-01 " + booking.end_time).format("hh:mm A")}
              </text>
            </div>
          </div>
        </div>
        <AttendanceCard booking={booking} />
        <div
          className="validate-booking-details-container"
          style={{ flexGrow: "1" }}
        >
          <h2 className="w-full border-b-[#00000020] border-solid border-b-2 pb-2 mb-8">
            Complete Cleanup Status
          </h2>
          <Formik
            initialValues={{
              volunteerTurnout: "",
              trashWeight: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              // Handle submit logic, e.g., API call
              fetch(process.env.REACT_APP_API + "api/bookings/" + booking.id, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: getToken(),
                },
                body: JSON.stringify({
                  date: booking.date,
                  start_time: booking.start_time,
                  end_time: booking.end_time,
                  num_volunteers: values.volunteerTurnout
                    ? values.volunteerTurnout
                    : "0",
                  collected_weight: values.trashWeight
                    ? values.trashWeight
                    : "0",
                  est_volunteers: booking.est_volunteers,
                  status: "completed",
                }),
              })
                .then((response) => {
                  setSubmitting(false);
                  if (response.ok) {
                    setCompletedBooking({
                      date: booking.date,
                      start_time: booking.start_time,
                      end_time: booking.end_time,
                      num_volunteers: values.volunteerTurnout,
                      collected_weight: values.trashWeight,
                      est_volunteers: booking.est_volunteers,
                      status: "completed",
                    });
                    setShowCleanupComplete(true);
                  }
                })
                .catch((error) => {
                  setSubmitting(false);
                  console.error("Submit error:", error);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form className="validate-details-form-container">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    width: "100%",
                    flexDirection: "space-between",
                  }}
                >
                  <div className="validate-details-form-group">
                    <label htmlFor="volunteerTurnout">
                      Total Volunteer Turnout
                      <MoreInfoPopUp
                        className="ml-2"
                        message={
                          "May be different from number of QR Code Scans"
                        }
                      />
                    </label>
                    <Field
                      className="w-full h-10 text-2xl mt-3 bg-[#3B88D040] px-2"
                      id="volunteerTurnout"
                      name="volunteerTurnout"
                      type="number"
                    />
                    <ErrorMessage
                      className="text-red-500"
                      name="volunteerTurnout"
                      component="div"
                    />
                  </div>
                  <div className="validate-details-form-group">
                    <label htmlFor="trashWeight">
                      Total Trash Weight (KG) - Optional
                    </label>
                    <Field
                      className="w-full h-10 text-2xl mt-3 bg-[#3B88D040] px-2"
                      id="trashWeight"
                      name="trashWeight"
                      type="number"
                    />
                    <ErrorMessage
                      className="text-red-500"
                      name="trashWeight"
                      component="div"
                    />
                  </div>
                </div>
                <div style={{ flexGrow: "5" }}></div>
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
            )}
          </Formik>
        </div>
      </div>
    );
  }
}
