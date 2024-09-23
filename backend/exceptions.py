from fastapi import status
from fastapi.responses import JSONResponse

EMAIL_USED = JSONResponse(
    status_code=status.HTTP_400_BAD_REQUEST,
    content={
        "message": "This email is already registered and cannot be used with a 3rd party identity provider"
    },
)

INACTIVE_USER = JSONResponse(
    status_code=status.HTTP_400_BAD_REQUEST,
    content={"message": "Inactive user"},
)

INVALID_CREDENTIALS = JSONResponse(
    status_code=status.HTTP_401_UNAUTHORIZED,
    content={"message": "Could not validate credentials"},
)

INVALID_AWS_CREDENTIALS = JSONResponse(
    status_code=status.HTTP_401_UNAUTHORIZED,
    content={"message": "Could not validate AWS credentials"},
)

BOOKING_NOT_FOUND = JSONResponse(
    status_code=status.HTTP_404_NOT_FOUND,
    content={"message": "Booking not found"},
)

BOOKING_MODIFY_UNAUTHORIZED = JSONResponse(
    status_code=status.HTTP_403_FORBIDDEN,
    content={"message": "Cannot modify a booking you do not own"},
)

LOCATION_NOT_FOUND = JSONResponse(
    status_code=status.HTTP_404_NOT_FOUND,
    content={"message": "Location not found"},
)
