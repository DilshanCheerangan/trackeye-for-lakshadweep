from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/entries",
    tags=["entries"],
)

@router.get("/", response_model=List[schemas.EntryResponse])
def get_entries(status: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Entry)
    if status:
        query = query.filter(models.Entry.status == status)
    return query.offset(skip).limit(limit).all()

@router.put("/{entry_id}/status", response_model=schemas.EntryResponse)
def update_entry_status(entry_id: str, update_data: schemas.EntryUpdate, db: Session = Depends(get_db)):
    entry = db.query(models.Entry).filter(models.Entry.entry_id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry.status = update_data.status
    db.commit()
    db.refresh(entry)
    return entry
