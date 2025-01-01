import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "bootstrap/dist/css/bootstrap.min.css";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

root.render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
