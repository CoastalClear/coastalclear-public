async function submitFeedback(feedback, bookingId) {
  return fetch(
    process.env.REACT_APP_API + "api/bookings/" + bookingId + "/feedback",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    }
  );
}

async function fetchBookingFromId(bookingId) {
  return fetch(process.env.REACT_APP_API + "api/bookings/public/" + bookingId, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}

async function fetchS3Url(file, s3FileName) {
  const response = await fetch(
    process.env.REACT_APP_API +
      `s3-upload-url?object_name=${s3FileName}&content_type=${file.type}&expires_in=60`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  if (!response.ok) {
    throw Error("Unable to fetch S3 URL");
  }
  return response.json();
}

async function putImage(s3_url, file) {
  const response = await fetch(s3_url, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw Error("Unable to upload image to S3 bucket");
  }
  return response;
}

const api = {
  submitFeedback,
  fetchBookingFromId,
  fetchS3Url,
  putImage,
};

export default api;
