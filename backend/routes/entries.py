from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/entries",
    tags=["entries"],
)

@router.get("/start-lists")
def get_start_lists(db: Session = Depends(get_db)):
    entries = db.query(models.Entry).filter(models.Entry.status == "APPROVED").all()
    
    # Group entries by event name
    grouped = {}
    for entry in entries:
        if entry.event_name not in grouped:
            grouped[entry.event_name] = []
        grouped[entry.event_name].append(entry)
        
    tracks = []
    fields = []
    
    for event_name, event_entries in grouped.items():
        is_field = any(x in event_name for x in ["JUMP", "THROW", "PUT"])
        if is_field:
            # Field event: assign sequential attempt order
            fields.append({
                "name": f"{event_name} - FINAL",
                "time": "TBA",
                "athletes": [
                    {"order": idx + 1, "name": entry.athlete_name, "island": entry.island}
                    for idx, entry in enumerate(event_entries)
                ]
            })
        else:
            # Track event: split into heats of up to 8 athletes
            # Automatically assign lanes 1 to 8
            chunk_size = 8
            for heat_idx in range(0, len(event_entries), chunk_size):
                heat_entries = event_entries[heat_idx:heat_idx + chunk_size]
                heat_num = (heat_idx // chunk_size) + 1
                heat_name = f"{event_name} - HEAT {heat_num}" if len(event_entries) > chunk_size else f"{event_name} - HEAT 1"
                tracks.append({
                    "name": heat_name,
                    "time": "TBA",
                    "athletes": [
                        {"lane": idx + 1, "name": entry.athlete_name, "island": entry.island}
                        for idx, entry in enumerate(heat_entries)
                    ]
                })
                
    return {
        "tracks": tracks,
        "fields": fields
    }

@router.get("/", response_model=List[schemas.EntryResponse])
def get_entries(status: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Entry)
    if status:
        query = query.filter(models.Entry.status == status)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.EntryResponse)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    db_item = models.Entry(**entry.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{entry_id}/status", response_model=schemas.EntryResponse)
def update_entry_status(entry_id: str, update_data: schemas.EntryUpdate, db: Session = Depends(get_db)):
    entry = db.query(models.Entry).filter(models.Entry.entry_id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry.status = update_data.status
    db.commit()
    db.refresh(entry)
    return entry
