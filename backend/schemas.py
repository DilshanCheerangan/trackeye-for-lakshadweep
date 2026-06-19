from pydantic import BaseModel
from typing import Optional

class AthleteBase(BaseModel):
    athlete_id: str
    name: str
    event: str
    island: str
    pb: str
    status: str

class AthleteCreate(AthleteBase):
    pass

class AthleteResponse(AthleteBase):
    id: int

    class Config:
        from_attributes = True

class AthleteUpdate(BaseModel):
    name: Optional[str] = None
    event: Optional[str] = None
    island: Optional[str] = None
    pb: Optional[str] = None
    status: Optional[str] = None

class CompetitionBase(BaseModel):
    name: str
    date_str: str
    location: str
    status: str
    athletes_count: int
    events_total: int
    events_completed: int
    color: str

class CompetitionCreate(CompetitionBase):
    pass

class CompetitionResponse(CompetitionBase):
    id: int

    class Config:
        from_attributes = True

class CompetitionUpdate(BaseModel):
    name: Optional[str] = None
    date_str: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    athletes_count: Optional[int] = None
    events_total: Optional[int] = None
    events_completed: Optional[int] = None
    color: Optional[str] = None

class IslandBase(BaseModel):
    name: str
    manager: str
    coach: str
    gold: int = 0
    silver: int = 0
    bronze: int = 0
    color: str = "bg-white"

class IslandCreate(IslandBase):
    pass

class IslandResponse(IslandBase):
    id: int

    class Config:
        from_attributes = True

class IslandUpdate(BaseModel):
    manager: Optional[str] = None
    coach: Optional[str] = None
    gold: Optional[int] = None
    silver: Optional[int] = None
    bronze: Optional[int] = None
    color: Optional[str] = None

class TrackEventBase(BaseModel):
    competition_id: int
    name: str
    event_type: str
    status: str = "PENDING"

class TrackEventCreate(TrackEventBase):
    pass

class TrackEventResponse(TrackEventBase):
    id: int

    class Config:
        from_attributes = True

class TrackEventUpdate(BaseModel):
    status: Optional[str] = None

class EntryBase(BaseModel):
    entry_id: str
    athlete_name: str
    island: str
    event_name: str
    age_group: str
    age_check: str = "PASS"
    dup_check: str = "PASS"
    clash_check: str = "PASS"
    status: str = "PENDING"

class EntryCreate(EntryBase):
    pass

class EntryUpdate(BaseModel):
    status: str

class EntryResponse(EntryBase):
    id: int

    class Config:
        from_attributes = True

class ResultBase(BaseModel):
    event_id: int
    athlete_name: str
    island: str
    position: int
    mark: str
    reaction: Optional[str] = None
    is_pb: bool = False
    new_record: Optional[str] = None
    lane_or_order: Optional[int] = None

class ResultCreate(ResultBase):
    pass

class ResultResponse(ResultBase):
    id: int

    class Config:
        from_attributes = True
