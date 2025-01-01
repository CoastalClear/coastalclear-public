import React, { createContext, useState, useContext } from "react";

const FeedbackLocationContext = createContext();

export function FeedbackLocationProvider({ children }) {
  const [feedbackLocation, setFeedbackLocation] = useState();
  return (
    <div>
      <FeedbackLocationContext.Provider
        value={{ feedbackLocation, setFeedbackLocation }}
      >
        {children}
      </FeedbackLocationContext.Provider>
    </div>
  );
}

export const useFeedbackLocation = () => useContext(FeedbackLocationContext);
