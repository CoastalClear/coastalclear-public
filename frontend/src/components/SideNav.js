// Sidebar.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mainLogo from "../coastal-clear-logo.png";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ProfileIcon from "./ProfileIcon";
import api from "../utility/api";
import { useUser } from "../UserContext";

const SideNav = () => {
  const [selectionStatus, setSelectionStatus] = useState(0);
  const { getUser, logout } = useUser();
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();

  function clickedProfileIcon() {
    if (!user) {
      setSelectionStatus(0);
      return navigate("/");
    }

    api.sendLogoutRequest();
    setTimeout(() => {
      setSelectionStatus(0);
      logout();
      navigate("/");
    }, 500);
  }

  function clickedLogo() {
    if (!user) {
      navigate("./");
      setSelectionStatus(0);
    } else {
      navigate("./map");
    }
  }

  useEffect(() => {
    getSelectionStatus();
  }, []);

  function getSelectionStatus() {
    switch (location.pathname) {
      case "/":
        return setSelectionStatus(0);
      case "/map":
        return setSelectionStatus(1);
      case "/manage":
        return setSelectionStatus(2);
    }
  }
  return (
    <div className="sidenav">
      <div className="sidenav-home-icon-square" onClick={clickedLogo}>
        <img
          style={{ width: "50px", height: "50px" }}
          src={mainLogo}
          alt="fireSpot"
        />
      </div>
      <div style={{ flexGrow: "3" }} />
      <div
        className="sidenav-icon-square"
        style={{
          backgroundColor: selectionStatus === 1 ? "#0D3B66" : "white",
          cursor: "pointer",
        }}
        onClick={() => {
          setSelectionStatus(1);
          navigate("./map");
        }}
      >
        <MapOutlinedIcon
          style={{
            color: selectionStatus === 1 ? "white" : "#0D3B66",
            width: "40px",
            height: "40px",
          }}
        />
        <t
          style={{
            color: selectionStatus === 1 ? "white" : "#0D3B66",
            marginTop: "2px",
          }}
        >
          Map
        </t>
      </div>
      <div
        className="sidenav-icon-square"
        style={{
          backgroundColor: selectionStatus === 2 ? "#0D3B66" : "white",
          cursor: "pointer",
        }}
        onClick={() => {
          setSelectionStatus(2);
          navigate("./manage");
        }}
      >
        <EventNoteOutlinedIcon
          style={{
            color: selectionStatus === 2 ? "white" : "#0D3B66",
            width: "40px",
            height: "40px",
          }}
        />
        <t
          style={{
            color: selectionStatus === 2 ? "white" : "#0D3B66",
            marginTop: "2px",
          }}
        >
          Bookings
        </t>
      </div>
      <div style={{ flexGrow: "3" }} />
      <ProfileIcon clickedProfileIcon={clickedProfileIcon} />
    </div>
  );
};

export default SideNav;
