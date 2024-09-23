import datetime as dt
import logging
from typing import Annotated, Optional, Union

import jwt
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

import auth
import exceptions
import models
import schemas
from database import get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


def db_get_bookings(
    db: Session, skip: int = 0, limit: int = 100
) -> list[models.Booking]:
    return db.query(models.Booking).offset(skip).limit(limit).all()


@router.get("/public", response_model=list[schemas.Booking])
async def read_public_bookings(db: Session = Depends(get_db)) -> list[schemas.Booking]:
    """Public endpoint to retrieve all bookings."""
    return db_get_bookings(db)


@router.get("/public/{booking_id}", response_model=schemas.Booking)
async def read_public_booking(
    booking_id: int, db: Session = Depends(get_db)
) -> Union[schemas.Booking, JSONResponse]:
    """Public endpoint to retrieve a booking by ID."""
    booking: Optional[models.Booking] = (
        db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    )
    if not booking:
        return exceptions.BOOKING_NOT_FOUND
    return booking


@router.get("", response_model=list[schemas.Booking])
async def read_user_bookings(
    token: Annotated[str, Depends(auth.OAUTH2_SCHEME)], db: Session = Depends(get_db)
) -> list[schemas.Booking]:
    """Allows an authenticated user to retrieve all their bookings."""
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGO])
        email: str = payload.get("sub")
        if email is None:
            return exceptions.INVALID_CREDENTIALS
    except InvalidTokenError:
        return exceptions.INVALID_CREDENTIALS
    user_id = db.query(models.User).filter(models.User.email == email).first().id
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()


@router.post("", response_model=schemas.Booking)
async def create_booking(
    token: Annotated[str, Depends(auth.OAUTH2_SCHEME)],
    booking_new: schemas.BookingCreate,
    db: Session = Depends(get_db),
) -> Union[schemas.Booking, JSONResponse]:
    """Allows an authenticated user to create a booking."""
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGO])
        email: str = payload.get("sub")
        if email is None:
            return exceptions.INVALID_CREDENTIALS
    except InvalidTokenError:
        return exceptions.INVALID_CREDENTIALS

    user = db.query(models.User).filter(models.User.email == email).first()
    location: Optional[models.Location] = (
        db.query(models.Location)
        .filter(models.Location.id == booking_new.location_id)
        .first()
    )

    if not location:
        return exceptions.LOCATION_NOT_FOUND

    booking = models.Booking(**booking_new.dict(), user_id=user.id, external=False)

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.put("/{booking_id}", response_model=schemas.Booking)
async def update_booking(
    token: Annotated[str, Depends(auth.OAUTH2_SCHEME)],
    booking_id: int,
    booking_new: schemas.BookingUpdate,
    db: Session = Depends(get_db),
) -> Union[schemas.Booking, JSONResponse]:
    """Allows an authenticated user to update a booking"""
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGO])
        email: str = payload.get("sub")
        if email is None:
            return exceptions.INVALID_CREDENTIALS
    except InvalidTokenError:
        return exceptions.INVALID_CREDENTIALS

    user = auth.get_user(db, email)
    db_booking = (
        db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    )

    if not db_booking:
        return exceptions.BOOKING_NOT_FOUND

    if db_booking.user_id != user.id:
        return exceptions.BOOKING_MODIFY_UNAUTHORIZED

    db_booking.date = booking_new.date
    db_booking.start_time = booking_new.start_time
    db_booking.end_time = booking_new.end_time
    db_booking.est_volunteers = booking_new.est_volunteers
    db_booking.num_volunteers = booking_new.num_volunteers
    db_booking.status = booking_new.status

    if booking_new.collected_weight:
        db_booking.collected_weight = booking_new.collected_weight

    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.delete("/{booking_id}")
async def db_delete_booking(
    token: Annotated[str, Depends(auth.OAUTH2_SCHEME)],
    booking_id: int,
    db: Session = Depends(get_db),
) -> JSONResponse:
    """Allows an authenticated user to delete a booking."""
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGO])
        email: str = payload.get("sub")
        if email is None:
            return exceptions.INVALID_CREDENTIALS
    except InvalidTokenError:
        return exceptions.INVALID_CREDENTIALS

    user = auth.get_user(db, email)
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()

    if not booking:
        return exceptions.BOOKING_NOT_FOUND
    if booking.user_id != user.id:
        return exceptions.BOOKING_MODIFY_UNAUTHORIZED

    db.delete(booking)
    db.commit()

    return JSONResponse({"message": "Booking deleted successfully"})


@router.post("/{booking_id}/feedback", response_model=schemas.Feedback)
async def create_feedback(
    booking_id: int,
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
) -> Union[schemas.Feedback, JSONResponse]:
    """Create feedback for a booking. This endpoint should only be valid for a certain time period around the booking"""
    # TODO: Add time-based validation
    booking: Optional[models.Booking] = (
        db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    )
    if not booking:
        return exceptions.BOOKING_NOT_FOUND

    feedback = models.Feedback(
        **feedback.dict(),
        datetime=dt.datetime.now(),
        booking_id=booking_id,
        location_id=booking.location_id
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


@router.put("/{booking_id}/attendance", response_model=schemas.Booking)
async def increment_attendance(
    booking_id: int,
    db: Session = Depends(get_db),
) -> Union[schemas.Booking, JSONResponse]:
    """Mark attendance for a booking. This endpoint should only be valid for a certain time period around the booking"""
    # TODO: Add time-based validation
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        return exceptions.BOOKING_NOT_FOUND

    booking.attendance += 1
    db.commit()
    db.refresh(booking)
    return booking
