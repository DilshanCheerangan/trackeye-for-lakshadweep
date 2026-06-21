from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/events",
    tags=["events"],
)

def recalculate_field_event_ranks(event_id: int, db: Session):
    # Check if the event is a FIELD event
    event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
    if not event or event.event_type != "FIELD":
        return

    # Fetch all results for this event
    results = db.query(models.Result).filter(models.Result.event_id == event_id).all()
    if not results:
        return

    def get_numeric_value(val: str) -> float:
        if not val:
            return -1.0
        val = val.strip().upper()
        if val in ("", "-", "X"):
            return -1.0
        try:
            # Clean up units like 'm' or spaces
            cleaned = "".join(c for c in val if c.isdigit() or c == '.')
            return float(cleaned) if cleaned else -1.0
        except ValueError:
            return -1.0

    def get_sort_key(r):
        mark_str = r.mark
        lane = r.lane_or_order or 999
        if not mark_str:
            return (2, [], lane)  # Category 2: untested/pending
            
        parts = mark_str.split(',')
        vals = []
        for p in parts:
            p = p.strip().upper()
            vals.append(get_numeric_value(p))
            
        has_valid = any(v >= 0 for v in vals)
        has_foul = any(p.strip().upper() == "X" for p in parts)
        
        if has_valid:
            # Category 0: valid scores (best trials negated for ascending sort)
            negated_sorted_vals = [-v for v in sorted(vals, reverse=True)]
            return (0, negated_sorted_vals, lane)
        elif has_foul:
            # Category 1: fouls only
            return (1, [], lane)
        else:
            # Category 2: untested only
            return (2, [], lane)

    # Sort results ascending using the sort key
    results.sort(key=get_sort_key)

    # Update positions (1-based index)
    rank = 1
    for r in results:
        key = get_sort_key(r)
        if key[0] == 2:  # Category 2 (untested) results get position 0
            r.position = 0
        else:
            r.position = rank
            rank += 1
            
    db.commit()


@router.get("/", response_model=List[schemas.TrackEventResponse])
def get_events(competition_id: int = None, event_type: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.TrackEvent)
    if competition_id is not None:
        query = query.filter(models.TrackEvent.competition_id == competition_id)
    if event_type:
        query = query.filter(models.TrackEvent.event_type == event_type)
    return query.offset(skip).limit(limit).all()

def determine_event_type(name: str) -> str:
    import re
    name_upper = name.upper()
    
    # Common field event terms
    field_keywords = [
        "JUMP", "THROW", "SHOTPUT", "SHOT PUT", "JAVELIN", 
        "DISCUS", "HAMMER", "VAULT", "PUT", "PENTATHLON", "DECATHLON"
    ]
    
    # Common track event terms
    track_keywords = [
        "100M", "200M", "400M", "800M", "1500M", "5000M", "10000M",
        "100 M", "200 M", "400 M", "800 M", "1500 M", "5000 M", "10000 M",
        "RELAY", "HURDLES", "RUN", "SPRINT", "DASH", "WALK", "MARATHON",
        "STEEPLECHASE", "100H", "110H", "400H"
    ]
    
    # Check field keywords
    for kw in field_keywords:
        if kw in name_upper:
            return "FIELD"
            
    # Check track keywords
    for kw in track_keywords:
        if kw in name_upper:
            return "TRACK"
            
    # Check regex for distance/relay patterns
    if re.search(r'\b\d+\s*M\b', name_upper) or re.search(r'\b\d+\s*X\s*\d+', name_upper):
        return "TRACK"
        
    return None

@router.post("/", response_model=schemas.TrackEventResponse)
def create_event(event: schemas.TrackEventCreate, db: Session = Depends(get_db)):
    auto_type = determine_event_type(event.name)
    event_data = event.model_dump()
    if auto_type:
        event_data["event_type"] = auto_type
        
    db_item = models.TrackEvent(**event_data)
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
    
    if db_event.status == "PENDING":
        db_event.status = "LIVE"
        
    db_item = models.Result(**result.model_dump())
    db.add(db_item)
    db.commit()
    
    # Recalculate positions
    recalculate_field_event_ranks(event_id, db)
    
    db.refresh(db_item)
    return db_item

@router.delete("/{event_id}/results")
def clear_event_results(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    db.query(models.Result).filter(models.Result.event_id == event_id).delete()
    db_event.status = "PENDING"
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
    
    # Recalculate positions
    recalculate_field_event_ranks(event_id, db)
    
    db.refresh(db_result)
    return db_result

@router.delete("/{event_id}/results/{result_id}")
def delete_event_result(event_id: int, result_id: int, db: Session = Depends(get_db)):
    db_result = db.query(models.Result).filter(models.Result.event_id == event_id, models.Result.id == result_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="Result not found")
        
    db.delete(db_result)
    db.commit()
    
    # Recalculate positions
    recalculate_field_event_ranks(event_id, db)
    
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
