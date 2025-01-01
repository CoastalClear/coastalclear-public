import React from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import { useUser } from "../UserContext";
import userUtils from "../utility/userUtils";

export default function ProfileIcon({ clickedProfileIcon }) {
  const { getUser } = useUser();
  const user = getUser();

  return (
    <>
      <p className="mb-0">{user ? "Logged In" : "Logged Out"}</p>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="button-tooltip-2">
            {user ? `Logged in as: ${user.email}. Click to logout` : "Login"}
          </Tooltip>
        }
      >
        {({ ref, ...triggerHandler }) => (
          <div
            ref={ref}
            {...triggerHandler}
            className="flex justify-center items-center w-16 h-16 border-4 bg-[#0D3B66] rounded-full mb-2 cursor-pointer"
            onClick={clickedProfileIcon}
          >
            {!user ? (
              <PersonOutlineOutlinedIcon
                style={{
                  color: "white",
                  width: "40px",
                  height: "40px",
                  weight: "100",
                }}
              />
            ) : (
              <p
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "0px",
                }}
              >
                {user.name
                  ? userUtils.getInitials(user.name)
                  : userUtils.getInitials(user.email)}
              </p>
            )}
          </div>
        )}
      </OverlayTrigger>
    </>
  );
}
