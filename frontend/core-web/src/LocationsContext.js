import React, { createContext, useState, useContext } from "react";

// Create the context object
const LocationsContext = createContext();

export const LocationsProvider = ({ children }) => {
  const [locationsArr, setLocationsArr] = useState([]); // Holds the queried bookings

  return (
    <LocationsContext.Provider value={{ locationsArr, setLocationsArr }}>
      {children}
    </LocationsContext.Provider>
  );
};

export const useLocation = () => useContext(LocationsContext);
