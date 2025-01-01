import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../UserContext";

const LoginWithGoogle = ({
  didLoginWithGoogle,
  showGoogleSignInFailedToast,
}) => {
  const { login } = useUser();
  const doGoogleLogin = useGoogleLogin({
    client_id: process.env.REACT_APP_GOOGLE_AUTH_ID,
    onSuccess: (tokenResponse) => successfulLogin(tokenResponse),
  });

  const successfulLogin = async (tokenResponse) => {
    let googleURL = "https://www.googleapis.com/oauth2/v2/userinfo";

    let getGoogleInfo = fetch(googleURL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + tokenResponse.access_token,
      },
    });

    let postLoginGoogle = fetch(process.env.REACT_APP_API + "login-google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokenResponse),
    });

    Promise.all([getGoogleInfo, postLoginGoogle]).then(async (results) => {
      const loginResponse = await results[1].json(); // Process the second response
      if (!results[0].ok) {
        showGoogleSignInFailedToast("Failed to fetch data from user");
        return;
      } else if (!results[1].ok) {
        console.error(loginResponse);
        showGoogleSignInFailedToast(loginResponse["message"]);
        return;
      }
      const googleResponse = await results[0].json(); // Process the first response

      let value = {
        email: googleResponse.email,
        name: googleResponse.name,
        access_token: loginResponse.access_token,
      };

      login(value);
      didLoginWithGoogle();
    });
  };
  return (
    <GoogleIcon
      style={{ height: "100px", width: "100px" }}
      className="border-2 p-3 border-solid border-black rounded-full cursor-pointer text-black active:text-red-700"
      onClick={doGoogleLogin}
    />
  );
};

export default LoginWithGoogle;
