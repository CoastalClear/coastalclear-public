import React from "react";
import { useUser } from "../UserContext";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { getToken } = useUser();
  if (getToken()) {
    return <Outlet />;
  } else {
    return <Navigate to="./" replace state={{ fromNotLoggedIn: true }} />;
  }
}
