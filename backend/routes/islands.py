from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/islands",
    tags=["islands"],
)

@router.get("/", response_model=List[schemas.IslandResponse])
def get_islands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    islands = db.query(models.Island).offset(skip).limit(limit).all()
    # Sort by gold, then silver, then bronze
    islands.sort(key=lambda x: (x.gold, x.silver, x.bronze), reverse=True)
    return islands

@router.post("/", response_model=schemas.IslandResponse)
def create_island(island: schemas.IslandCreate, db: Session = Depends(get_db)):
    db_island = models.Island(**island.model_dump())
    db.add(db_island)
    db.commit()
    db.refresh(db_island)
    return db_island

@router.put("/{id}", response_model=schemas.IslandResponse)
def update_island(id: int, island: schemas.IslandUpdate, db: Session = Depends(get_db)):
    db_island = db.query(models.Island).filter(models.Island.id == id).first()
    if not db_island:
        raise HTTPException(status_code=404, detail="Island not found")
    
    for key, value in island.model_dump(exclude_unset=True).items():
        setattr(db_island, key, value)
        
    db.commit()
    db.refresh(db_island)
    return db_island

@router.delete("/{id}")
def delete_island(id: int, db: Session = Depends(get_db)):
    db_island = db.query(models.Island).filter(models.Island.id == id).first()
    if not db_island:
        raise HTTPException(status_code=404, detail="Island not found")
        
    db.delete(db_island)
    db.commit()
    return {"message": "Island deleted successfully"}
