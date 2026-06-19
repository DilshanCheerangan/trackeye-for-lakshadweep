from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/events",
    tags=["events"],
)

@router.get("/", response_model=List[schemas.TrackEventResponse])
def get_events(event_type: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.TrackEvent)
    if event_type:
        query = query.filter(models.TrackEvent.event_type == event_type)
    return query.offset(skip).limit(limit).all()

@router.get("/{event_id}/results", response_model=List[schemas.ResultResponse])
def get_event_results(event_id: int, db: Session = Depends(get_db)):
    results = db.query(models.Result).filter(models.Result.event_id == event_id).all()
    results.sort(key=lambda x: x.position)
    return results

@router.put("/{event_id}/approve", response_model=schemas.TrackEventResponse)
def approve_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.status = "OFFICIAL"
    db.commit()
    db.refresh(event)

    # Note: In a real system, you would calculate and assign medals to Islands here
    # For MVP, we are assuming Islands are updated independently or manually.

    return event
