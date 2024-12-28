import React from "react";
import cleanPNG from "../clean.png";
import dirtyPNG from "../dirty.png";
import veryDirtyPNG from "../very-dirty.png";

const PopUp = ({ feature, count }) => {
  function getCategory(score) {
    const ratio = score / 4000;
    if (ratio < 0.33) {
      return 1;
    } else if (ratio < 0.66) {
      return 2;
    } else {
      return 3;
    }
  }

  function getPNG(feature) {
    const cat = getCategory(feature.cleanliness_score);

    switch (cat) {
      case 1:
        return cleanPNG;
      case 2:
        return dirtyPNG;
      case 3:
        return veryDirtyPNG;
    }
  }

  return (
    <div
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        display: "flex",
        paddingTop: "15px",
        height: "100%",
      }}
    >
      <t
        style={{
          fontSize: "26px",
          width: "90%",
          textAlign: "center",
          fontWeight: "600",
          paddingBottom: "15px",
          borderBottom: "2px solid #00000030",
        }}
      >
        {feature.name}
      </t>
      <div className="popup-container">
        <div className="popup-left">
          <t style={{ fontSize: "18px" }}>Cleanliness Score</t>
          <img
            style={{ width: "158px", height: "58px" }}
            src={getPNG(feature)}
            alt="fireSpot"
          />
        </div>
        <div className="popup-divider"></div>
        <div className="popup-left">
          <t style={{ fontSize: "18px" }}>Bookings +/-3 Days</t>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "60px",
              height: "60px",
            }}
          >
            {count}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
