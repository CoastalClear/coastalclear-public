import datetime as dt
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import exceptions
import models
import schemas
from database import get_db

router = APIRouter()


# TODO: Refactor score calculation
def get_cleanliness_score(
    location_id: int, db: Session, query_date: dt.date = dt.date.today()
) -> float:
    """
    Get cleanliness scores for all locations on a current date. By default, we query the current date
    """
    month_days = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    }
    curr_mth_no = query_date.month
    prev_mth_no = (12 + curr_mth_no - 1) % 12

    curr_mth_record = (
        db.query(models.HistoricalMonthlyFlotsam)
        .filter(
            models.HistoricalMonthlyFlotsam.location_id == location_id,
            models.HistoricalMonthlyFlotsam.month == curr_mth_no,
        )
        .first()
    )

    prev_mth_record = (
        db.query(models.HistoricalMonthlyFlotsam)
        .filter(
            models.HistoricalMonthlyFlotsam.location_id == location_id,
            models.HistoricalMonthlyFlotsam.month == prev_mth_no,
        )
        .first()
    )

    if not curr_mth_record or not prev_mth_record:
        return -1

    day = query_date.day
    remaining_days = month_days[curr_mth_no] - day
    return (remaining_days / month_days[prev_mth_no]) * prev_mth_record.weight + (
        day / month_days[curr_mth_no]
    ) * curr_mth_record.weight


def get_locations(
    db: Session, skip: int = 0, limit: int = 100
) -> list[models.Location]:
    return db.query(models.Location).offset(skip).limit(limit).all()


def get_location(db: Session, location_id: int) -> Optional[models.Location]:
    return db.query(models.Location).filter(models.Location.id == location_id).first()


def create_location(db: Session, location: schemas.Location) -> models.Location:
    db_location = models.Location(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location


def delete_location(db: Session, location: schemas.Location) -> None:
    db_location = (
        db.query(models.Location).filter(models.Location.id == location.id).first()
    )
    db.delete(db_location)
    db.commit()


@router.get("", response_model=list[schemas.Location])
async def read_locations(
    date_day: dt.date = dt.date.today(), db: Session = Depends(get_db)
) -> list[schemas.Location]:
    """Get all locations and respective cleanliness scores for each location on the current date."""
    locations = [schemas.Location.from_orm(location) for location in get_locations(db)]

    for loc in locations:
        loc.cleanliness_score = get_cleanliness_score(loc.id, db, date_day)

    return locations


# TODO: Only return bookings based on +- 30 days from the current date
@router.get("/{location_id}", response_model=schemas.Location)
async def read_location_by_id(
    location_id: int, date_day: dt.date = dt.date.today(), db: Session = Depends(get_db)
) -> schemas.Location:
    """Get a location by ID and its cleanliness score for the current date."""
    loc_model = get_location(db, location_id)

    if not loc_model:
        raise exceptions.LOCATION_NOT_FOUND

    location = schemas.Location.from_orm(get_location(db, location_id))
    location.cleanliness_score = get_cleanliness_score(location_id, db, date_day)

    return location


# @router.post("/")
# async def create_location(token: Annotated[str, Depends(auth.oauth2_scheme)]) -> Any:
#     pass


# @router.put("/{location_id}")
# async def update_location(token: Annotated[str, Depends(auth.oauth2_scheme)], id: int, data: dict) -> Any:
#     pass


# @router.delete("/{location_id}")
# async def delete_location(token: Annotated[str, Depends(auth.oauth2_scheme)], id: int) -> Any:
#     pass
