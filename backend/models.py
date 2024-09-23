from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Date,
    DateTime,
    Float,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, unique=True, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_pwd = Column(String, nullable=True)
    number = Column(String, nullable=True)
    name = Column(String, nullable=True)
    external_provider = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    bookings = relationship("Booking", back_populates="user")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, unique=True, primary_key=True)
    name = Column(String, nullable=False)
    cleanliness_score = Column(Float)
    geojson = Column(JSONB, nullable=False)
    bookings = relationship("Booking", back_populates="location")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, unique=True, primary_key=True)
    date = Column(Date, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    est_volunteers = Column(String)
    num_volunteers = Column(Integer)
    status = Column(
        String, default="scheduled", nullable=False
    )  # scheduled, pending, completed, missed
    collected_weight = Column(Float, nullable=True)
    attendance = Column(Integer, default=0, nullable=False)
    external = Column(Boolean, default=False)
    feedback = relationship("Feedback", back_populates="booking")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="bookings")
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    location = relationship("Location", back_populates="bookings")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, unique=True, primary_key=True)
    datetime = Column(DateTime, nullable=False)
    title = Column(String, nullable=True)
    comment = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    coords = Column(JSONB, nullable=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    booking = relationship("Booking", back_populates="feedback")


class HistoricalMonthlyFlotsam(Base):
    __tablename__ = "historical_monthly_flotsam"

    id = Column(Integer, unique=True, primary_key=True)
    month = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
