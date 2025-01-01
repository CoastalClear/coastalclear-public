import React, { useState } from "react";
import RecentFeedbackRow from "./RecentFeedbackRow";
import { Button } from "react-bootstrap";

export default function RecentFeedback({ feedbackArr, didClickFeedback }) {
  return (
    <div className={`items-center w-full`}>
      {feedbackArr &&
        feedbackArr.map((feedback) => (
          <RecentFeedbackRow
            feedback={feedback}
            didClickFeedback={() => didClickFeedback(feedback)}
          />
        ))}
    </div>
  );
}
