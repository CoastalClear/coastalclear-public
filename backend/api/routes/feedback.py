import datetime as dt

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter()


@router.get("", response_model=list[schemas.Feedback])
async def read_feedback(
    location_id: int, date_day: dt.date = dt.date.today(), db: Session = Depends(get_db)
) -> list[schemas.Feedback]:
    """Public endpoint to retrieve all feedback for a location, within 30 days of a given date"""
    return (
        db.query(models.Feedback)
        .filter(
            models.Feedback.location_id == location_id,
            models.Feedback.datetime <= date_day + dt.timedelta(days=1),
            models.Feedback.datetime >= date_day - dt.timedelta(days=30),
        )
        .all()
    )
