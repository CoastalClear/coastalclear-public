import React from "react";

export default function LocationBadge({ title, icon, rightComponent }) {
  return (
    <div
      style={{
        backgroundColor: "#E5F3FF",
        color: "#05294B",
        fontSize: "16px",
        display: "flex",
        paddingLeft: "10px",
        paddingRight: "10px",
        height: "40px",
        alignItems: "center",
        borderRadius: "20px",
        flex: "0 1 auto",
      }}
    >
      <div
        style={{
          marginRight: "15px",
          flex: "0 1 auto",
        }}
      >
        {icon}
      </div>
      <text
        style={{
          marginRight: "15px",
          flex: "0 1 auto",
        }}
      >
        {title}
      </text>
      <div style={{ flex: "0 1 auto" }}>{rightComponent}</div>
    </div>
  );
}
