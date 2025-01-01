import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, setIn } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

import dayjs from "dayjs";
import BookingTitle from "../components/BookingTitle";
import api from "../utils/api";
import { useBooking } from "../context/BookingContext";

import Switch from "@mui/material/Switch";

export default function ReportingPage() {
  const [inputedValues, setInputedValues] = useState({});
  const [hasSubmittedPhoto, setHasSubmittedPhoto] = useState(false);
  const [submittedImage, setSubmittedImage] = useState("");
  const [locationCheck, setLocationCheck] = useState(false);
  const [location, setLocation] = useState({});
  const navigate = useNavigate();
  const { booking } = useBooking();

  const fileInputRef = useRef(null);

  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
      default:
        alert("An unspecified error occurred.");
    }
  };

  // Function to handle manual clicks on the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Simulates click on the input
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const s3FileName = dayjs().format("DDMMYYYYhhmm") + file.name;
    if (file) {
      api
        .fetchS3Url(file, s3FileName)
        .then((s3_url) => {
          setSubmittedImage(s3_url.split("?")[0]);
          return api.putImage(s3_url, file);
        })
        .then(() => {
          setHasSubmittedPhoto(true);
        })
        .catch((err) => {
          console.error(err);
          setSubmittedImage("");
          setHasSubmittedPhoto(false);
        });
    }
  };
  const validationSchema = Yup.object({
    title: Yup.string()
      .max(40, "Not more than 40 characters please")
      .required("Title is required"),
    comment: Yup.string().max(500, "Not more than 500 characters please"),
  });

  const submitFeedbackForm = (finalValues) => {
    finalValues = {
      ...finalValues,
      coords: location,
      image_url: submittedImage,
      location: booking.location.id,
    };
    api
      .submitFeedback(finalValues, booking.id)
      .then((resp) => {
        if (resp.ok) {
          navigate("/complete");
          return;
        }
        throw Error("Feedback submission failed");
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (values) => {
    if (!locationCheck) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        setLocation({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
        });
      }, showError);
    } else {
      setLocation({});
    }
    setLocationCheck((check) => !check);
  };

  return (
    <div className="p-4 max-w-md bg-white shadow-lg rounded-lg h-screen">
      <BookingTitle />
      <p className="">See something you want the next organiser to know?</p>
      <Formik
        initialValues={{ title: "", comment: "", location: {} }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          submitFeedbackForm(values);
        }}
      >
        {({ submitForm, setSubmitting, setFieldValue, validateForm }) => (
          <Form className="space-y-6">
            <div className="flex items-start flex-col ">
              <Field name="location" type="hidden" />
              <label
                htmlFor="title"
                className="text-xs font-medium text-gray-700"
              >
                Title
              </label>

              <Field
                name="title"
                type="text"
                className="text-sm mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Bring rakes for the area under the bridge"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="flex items-start flex-col ">
              <label
                htmlFor="comment"
                className="block text-xs font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <Field
                as="textarea"
                name="comment"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter description"
                rows="5"
              />
              <ErrorMessage
                name="comment"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <button
              type="button"
              onClick={handleButtonClick}
              className="w-full py-2 text-sm rounded-md bg-white text-gray-800 border border-gray-800 basis-1/2"
            >
              <CollectionsOutlinedIcon className="mr-2" />
              {hasSubmittedPhoto ? "Change Photo" : "Take or Upload a photo"}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the file input
                accept="image/*"
                onChange={handleFileChange}
              />
            </button>
            <div>
              <div
                className="flex w-full justify-center mb-2"
                onClick={handleChange}
              >
                <Switch
                  checked={locationCheck}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <p className="mb-0 flex items-center">
                  Share current location with us
                </p>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600"
              >
                Share Feedback
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
