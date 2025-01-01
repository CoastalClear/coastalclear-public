import React, { createContext, useState, useContext } from "react";

// Create the context object
const UserContext = createContext();

// Provider component that wraps your app and makes the user object accessible to any child component
export const UserProvider = ({ children }) => {
  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  };

  function getUser() {
    if (
      localStorage.getItem("user") &&
      getToken() &&
      !isTokenExpired(getToken())
    ) {
      return JSON.parse(localStorage.getItem("user"));
    } else {
      logout();
      return null;
    }
  }

  // Retrieving the token
  function getToken() {
    const fetchedToken = localStorage.getItem("jwtToken");

    if (fetchedToken && !isTokenExpired(fetchedToken)) {
      return fetchedToken;
    }

    return "";
  }

  function getEmail() {
    const fetchedToken = localStorage.getItem("jwtToken");

    if (fetchedToken && !isTokenExpired(fetchedToken)) {
      return localStorage.getItem("email");
    }

    return "";
  }

  // Login function to update the user state
  const login = (userData) => {
    localStorage.setItem("jwtToken", "Bearer " + userData.access_token);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function to clear the user state
  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{ login, logout, getToken, getEmail, getUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
