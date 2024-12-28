import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import comeBackLogo from "../come-back-confirm.png";
import forwardEmailLogo from "../forward-email.png";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function BookingConfirmCard() {
  return (
    <Card
      sx={{
        width: "100%",
        flexShrink: "0",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#00000010",
      }}
    >
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <t
          style={{
            fontSize: "32px",
            color: "#5E5E5E",
            marginBottom: "15px",
            fontWeight: "600",
          }}
        >
          What's Next
        </t>
        <div className="flex">
          <img className="w-6 h-6 mr-3" src={comeBackLogo} alt="fireSpot" />
          <t className="text-l text-[#5E5E5E] font-medium mb-3">
            Come back here to complete your cleanup details and inspire others!
          </t>
        </div>
        <div className="flex">
          <img className="w-6 h-6 mr-3" src={forwardEmailLogo} alt="fireSpot" />
          <t className="text-l text-[#5E5E5E] font-medium">
            Forward the email that we have sent to your volunteers as
            invitations
          </t>
        </div>
      </CardContent>
    </Card>
  );
}
