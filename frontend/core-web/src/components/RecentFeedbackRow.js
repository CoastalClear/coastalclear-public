import React from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import dayjs from "dayjs";

export default function RecentFeedbackRow({ feedback, didClickFeedback }) {
  return (
    <div
      onClick={() => didClickFeedback(feedback)}
      className="flex items-center w-full h-[50px] mb-1 border-1 border-[#D0D5DD] rounded-md px-2 text-m cursor-pointer"
    >
      <p className="mb-0 flex-[2] max-w-[50%] overflow-x-hidden text-nowrap">
        {feedback.title.length <= 25
          ? feedback.title
          : feedback.title.substring(0, 25) + "..."}
      </p>
      <p className="mb-0 flex-[1]">{dayjs(feedback.date).format("DD MMM")}</p>
      {feedback.location && (
        <LocationOnRoundedIcon className="text-[#0D3B66]" />
      )}
      {feedback.image && <ImageRoundedIcon />}
    </div>
  );
}
