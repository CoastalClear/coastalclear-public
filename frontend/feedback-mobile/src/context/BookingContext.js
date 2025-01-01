import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({});

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
