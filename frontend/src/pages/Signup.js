import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Signup.css";
import Button from "react-bootstrap/Button";

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  fullName: Yup.string().required("Display Name is required"),
  password: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export default function Signup({ setIsLoginMode }) {
  const [isCompleted, setIsCompleted] = useState(false);

  return !isCompleted ? (
    <div className="signup-page-container">
      <Formik
        initialValues={{
          email: "",
          fullName: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          const response = await fetch(process.env.REACT_APP_API + "register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
              name: values.fullName,
            }),
          });

          if (response.ok) {
            const data = await response.json();

            alert(
              "Registration Successful. Welcome to Coastal Clear " +
                values.fullName
            );
            setIsLoginMode(true);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="signup-form-container">
            <h2 className="mb-10">Create an account</h2>
            <div className="signup-form-field">
              <div style={{ display: "flex" }}>
                <p className="text-lg mx-1 mb-0">Email:</p>
                <ErrorMessage
                  className="text-lg text-red-500 ml-4"
                  name="email"
                  component="div"
                />
              </div>
              <Field className="signup-form-input" type="email" name="email" />
            </div>
            <div className="signup-form-field">
              <div style={{ display: "flex" }}>
                <p className="text-lg mx-1 mb-0">Display Name:</p>
                <ErrorMessage
                  className="text-lg text-red-500 ml-4"
                  name="fullName"
                  component="div"
                />
              </div>
              <Field
                className="signup-form-input"
                type="text"
                name="fullName"
              />
            </div>
            <div className="signup-form-field">
              <div style={{ display: "flex" }}>
                <p className="text-lg mx-1 mb-0">Password:</p>
                <ErrorMessage
                  className="text-lg text-red-500 ml-4"
                  name="password"
                  component="div"
                />
              </div>
              <Field
                className="signup-form-input"
                type="password"
                name="password"
              />
            </div>
            <div className="signup-form-field">
              <div style={{ display: "flex" }}>
                <p className="text-lg mx-1 mb-0">Confirm Password:</p>
                <ErrorMessage
                  className="text-lg text-red-500 ml-4"
                  name="confirmPassword"
                  component="div"
                />
              </div>
              <Field
                className="signup-form-input"
                type="password"
                name="confirmPassword"
              />
            </div>
            <Button className="mb-3" type="submit" disabled={isSubmitting}>
              Create account
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  ) : (
    <div className="signup-page-container"></div>
  );
}
