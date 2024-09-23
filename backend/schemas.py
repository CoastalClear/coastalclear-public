import datetime as dt
from typing import Optional

from pydantic import BaseModel


class UserBase(BaseModel):
    id: int
    email: str


class LocationBase(BaseModel):
    id: int
    name: str


class BookingBase(BaseModel):
    id: int
    date: dt.date
    start_time: str
    end_time: str
    est_volunteers: str
    num_volunteers: int
    status: str
    attendance: int
    external: bool
    location_id: int
    user_id: int

    class Config:
        from_attributes = True


class FeedbackBase(BaseModel):
    id: int
    datetime: dt.datetime
    title: str
    comment: Optional[str] = None
    image_url: Optional[str] = None
    coords: Optional[dict] = None


class Feedback(BaseModel):
    id: int
    datetime: dt.datetime
    location_id: int
    booking_id: int
    title: str
    comment: Optional[str] = None
    image_url: Optional[str] = None
    coords: Optional[dict] = None


class FeedbackCreate(BaseModel):
    title: str
    comment: Optional[str] = None
    image_url: Optional[str] = None
    coords: Optional[dict] = None


class Booking(BaseModel):
    id: int
    date: dt.date
    start_time: str
    end_time: str
    est_volunteers: str
    num_volunteers: int
    status: str
    collected_weight: Optional[float] = None
    location_id: int
    location: LocationBase
    user_id: int
    user: UserBase
    attendance: int
    feedback: list[FeedbackBase]

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    date: dt.date
    start_time: str
    end_time: str
    est_volunteers: str
    num_volunteers: int
    location_id: int


class BookingUpdate(BaseModel):
    date: dt.date
    start_time: str
    end_time: str
    est_volunteers: str
    num_volunteers: int
    status: str
    collected_weight: Optional[float] = None


class User(BaseModel):
    id: int
    email: str
    is_active: bool
    bookings: list[Booking]

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: str
    name: Optional[str] = None
    password: str
    external_provider: bool = False


class UserCreateExternalProvider(BaseModel):
    email: str
    name: Optional[str] = None
    external_provider: bool = True


class Location(LocationBase):
    id: int
    cleanliness_score: float
    geojson: dict
    bookings: list[BookingBase]

    class Config:
        from_attributes = True


class HistoricalMonthlyFlotsam(BaseModel):
    id: int
    month: int
    weight: float
    location_id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
