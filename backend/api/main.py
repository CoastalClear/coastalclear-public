from fastapi import APIRouter

from api.routes import bookings, locations, feedback

api_router = APIRouter()
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(locations.router, prefix="/locations", tags=["locations"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
