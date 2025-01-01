import React from "react";
import loginImage from "../login-image.png";

export default function LoginLeftGraphic() {
  return (
    <div className="flex w-full h-full">
      <img className="login-image" src={loginImage} />
    </div>
  );
}
