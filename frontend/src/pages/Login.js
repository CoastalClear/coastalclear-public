import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFormik } from "formik";
import { useUser } from "../UserContext";
import Snackbar from "@mui/material/Snackbar";
import { Alert, Divider } from "@mui/material";
import LoginLeftGraphic from "../components/LoginLeftGraphic";
import LoginWithGoogle from "../components/LoginWithGoogle";
import api from "../utility/api";

import SignUp from "./Signup";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnack, setOpenSnack] = useState(true);
  const [accountExistsAlertShow, setAccountExistsAlertShow] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { login, getToken } = useUser();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      api
        .sendLoginRequest(values)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          setFailed(true);
          throw Error("Log in failed");
        })
        .then((data) => {
          let userData = {
            access_token: data.access_token,
            email: values.email,
          };
          login(userData);
        })
        .then(() => navigate("/map"))
        .catch((err) => console.error(err));
      setSubmitting(false);
    },
    validate: (values) => {
      let errors = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      return errors;
    },
  });

  const didLoginWithGoogle = () => {
    navigate("/map");
  };

  const showGoogleSignInFailedToast = (errorMessage) => {
    setGoogleErrorMessage(errorMessage);
    setAccountExistsAlertShow(true);
  };

  function handleNotLoggedInClose() {
    location.state.isFromNotLoggedIn = false;
    setOpenSnack(false);
  }

  function handleFailedLoginSnackbarClose() {
    setFailed(false);
  }

  function handleClickSignUp() {
    setIsLoginMode(false);
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={accountExistsAlertShow}
        onClose={() => setAccountExistsAlertShow(false)}
        autoHideDuration={3000}
        message={"Sign in with Google Failed: " + googleErrorMessage}
      >
        <Alert
          onClose={() => setAccountExistsAlertShow(false)}
          severity="error"
          color="error"
          sx={{ width: "100%" }}
        >
          {"Sign in with Google Failed: " + googleErrorMessage}
        </Alert>
      </Snackbar>
      {location?.state?.fromNotLoggedIn && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnack}
          onClose={handleNotLoggedInClose}
          autoHideDuration={3000}
          message="Please Log in"
        >
          <Alert
            onClose={handleNotLoggedInClose}
            severity="error"
            color="warning"
            sx={{ width: "100%" }}
          >
            Please Log In
          </Alert>
        </Snackbar>
      )}
      {
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={failed}
          onClose={handleFailedLoginSnackbarClose}
          autoHideDuration={3000}
          message="Please Log in"
        >
          <Alert
            onClose={handleFailedLoginSnackbarClose}
            severity="error"
            color="error"
            sx={{ width: "100%" }}
          >
            Incorrect Email Address or Password
          </Alert>
        </Snackbar>
      }

      <div className="login-container">
        <LoginLeftGraphic />
        {isLoginMode ? (
          <div className="login-form">
            <Form
              className="login-form-internal"
              onSubmit={formik.handleSubmit}
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  isInvalid={formik.touched.email && formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                style={{ marginBottom: "10px" }}
              >
                Login
              </Button>
              <p style={{ fontSize: "18px" }}>
                Don't have an account?{" "}
                <Link onClick={handleClickSignUp}>Sign up</Link> here!
              </p>
            </Form>
            <Divider style={{ width: "100%", marginBottom: "20px" }}>
              Log in with google
            </Divider>
            <LoginWithGoogle
              didLoginWithGoogle={didLoginWithGoogle}
              showGoogleSignInFailedToast={showGoogleSignInFailedToast}
            />
          </div>
        ) : (
          <SignUp setIsLoginMode={setIsLoginMode} />
        )}
      </div>
    </>
  );
}
