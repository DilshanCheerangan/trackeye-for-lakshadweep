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
def get_events(competition_id: int = None, event_type: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.TrackEvent)
    if competition_id is not None:
        query = query.filter(models.TrackEvent.competition_id == competition_id)
    if event_type:
        query = query.filter(models.TrackEvent.event_type == event_type)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.TrackEventResponse)
def create_event(event: schemas.TrackEventCreate, db: Session = Depends(get_db)):
    db_item = models.TrackEvent(**event.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Also delete associated results
    db.query(models.Result).filter(models.Result.event_id == event_id).delete()
    db.delete(db_event)
    db.commit()
    return {"message": "Event and its results deleted successfully"}

@router.get("/{event_id}/results", response_model=List[schemas.ResultResponse])
def get_event_results(event_id: int, db: Session = Depends(get_db)):
    results = db.query(models.Result).filter(models.Result.event_id == event_id).all()
    results.sort(key=lambda x: x.position)
    return results

@router.post("/{event_id}/results", response_model=schemas.ResultResponse)
def create_event_result(event_id: int, result: schemas.ResultCreate, db: Session = Depends(get_db)):
    # Check if event exists
    db_event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db_item = models.Result(**result.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{event_id}/results")
def clear_event_results(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    db.query(models.Result).filter(models.Result.event_id == event_id).delete()
    db.commit()
    return {"message": "Event results cleared"}

@router.put("/{event_id}/results/{result_id}", response_model=schemas.ResultResponse)
def update_event_result(event_id: int, result_id: int, result: schemas.ResultCreate, db: Session = Depends(get_db)):
    db_result = db.query(models.Result).filter(models.Result.event_id == event_id, models.Result.id == result_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    for key, value in result.model_dump().items():
        setattr(db_result, key, value)
        
    db.commit()
    db.refresh(db_result)
    return db_result

@router.delete("/{event_id}/results/{result_id}")
def delete_event_result(event_id: int, result_id: int, db: Session = Depends(get_db)):
    db_result = db.query(models.Result).filter(models.Result.event_id == event_id, models.Result.id == result_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="Result not found")
        
    db.delete(db_result)
    db.commit()
    return {"message": "Result deleted successfully"}

@router.put("/{event_id}/approve", response_model=schemas.TrackEventResponse)
def approve_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.status = "OFFICIAL"
    db.commit()
    db.refresh(event)

    return event
