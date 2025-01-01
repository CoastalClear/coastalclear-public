import React from "react";

import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

function MoreInfoPopUp({ message }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 150, hide: 400 }}
      overlay={renderTooltip}
    >
      <HelpOutlineOutlinedIcon className="mx-2" />
    </OverlayTrigger>
  );
}

export default MoreInfoPopUp;
