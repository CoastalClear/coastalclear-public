import React, { useState } from "react";
import dayjs from "dayjs";
import timeUtils from "../utility/timeUtils";
import { useLocation } from "../LocationsContext";
import { Modal } from "react-bootstrap";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";

export default function FeedbackModal({ feedback, currentLocation }) {
  const { location } = useLocation;
  const [imageModalOpen, setImageModalOpen] = useState(false);
  console.log(currentLocation);
  return (
    <>
      <Modal
        show={imageModalOpen}
        onHide={() => setImageModalOpen(false)}
        centered
        size="m"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img
            src={feedback?.image_url}
            alt={"image"}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Modal.Body>
      </Modal>
      <div className="w-full h-full">
        <h1 className="text-5xl mb-2 border-b-4 border-[#00000020] pb-2">
          {feedback.title?.slice(0, 40) +
            (feedback?.title?.length > 40 ? "..." : "")}
        </h1>
        <p className="text-4xl mb-1 mt-3">{currentLocation?.name}</p>
        <p className="text-[#3B88D0] text-2xl mb-[60px] font-light">
          {dayjs(feedback.datetime).format("DD MMM YYYY")}
          <span className="text-2xl font-light mx-6">{"|"}</span>
          {timeUtils.getLocalTime(feedback.datetime).format("hh:mm A")}
        </p>
        <div
          className="flex flex-col w-full items-center mb-3 cursor-pointer"
          onClick={() => setImageModalOpen(true)}
        >
          <p className="text-3xl font-medium w-full mb-3">
            Photo
            <ZoomInRoundedIcon className="ml-3 text-4xl " />
          </p>
          {feedback.image_url ? (
            <img
              className="w-full h-[300px] object-cover "
              src={feedback.image_url}
            />
          ) : (
            <p className="font-style: italic w-full text-[#00000060]">
              The user did not provide a photo
            </p>
          )}
        </div>
        <p className="mt-[60px] text-3xl font-medium pb-1 w-full border-b-4 border-[#00000020] mb-3">
          Description
        </p>
        {feedback.comment ? (
          <p className="text-xl">{feedback.comment}</p>
        ) : (
          <p className="font-style: italic text-[#00000060]">
            The user did not provide a description
          </p>
        )}
      </div>
    </>
  );
}
