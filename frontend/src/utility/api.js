import dayjs from "dayjs";

async function sendLoginRequest(values) {
  const response = fetch(process.env.REACT_APP_API + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: values.email,
      password: values.password,
    }),
  });

  return response;
}

async function queryLocations(date) {
  const response = await fetch(
    process.env.REACT_APP_API +
      "api/locations" +
      "?dt=" +
      dayjs(date).format("YYYY-MM-DD"),
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  return response.json();
}

async function querySpecificLocation(locationId, date) {
  const response = await fetch(
    process.env.REACT_APP_API +
      "api/locations/" +
      locationId +
      "?dt=" +
      dayjs(date).format("YYYY-MM-DD"),
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  return response.json();
}

async function sendLogoutRequest() {
  const response = await fetch(process.env.REACT_APP_API + "logout", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return response.json();
}

async function queryFeedbackData(locationId, date) {
  const response = await fetch(
    process.env.REACT_APP_API +
      `api/feedback?location_id=${locationId}&date_day=${date}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.ok) {
    return response.json();
  }
  throw Error("Failed to query feedback data");
}

async function sendRegisterRequest() {}

const api = {
  sendLoginRequest,
  sendRegisterRequest,
  queryLocations,
  querySpecificLocation,
  sendLogoutRequest,
  queryFeedbackData,
};

export default api;
