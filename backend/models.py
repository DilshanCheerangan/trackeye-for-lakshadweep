from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Athlete(Base):
    __tablename__ = "athletes"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(String, unique=True, index=True) # e.g. ATH-1001
    name = Column(String, index=True)
    event = Column(String)
    island = Column(String)
    pb = Column(String) # Personal Best
    status = Column(String, default="ACTIVE")

class Competition(Base):
    __tablename__ = "competitions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date_str = Column(String)
    location = Column(String)
    status = Column(String, default="UPCOMING")
    athletes_count = Column(Integer, default=0)
    events_total = Column(Integer, default=0)
    events_completed = Column(Integer, default=0)
    color = Column(String, default="bg-track-dark")

class Island(Base):
    __tablename__ = "islands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    manager = Column(String)
    coach = Column(String)
    gold = Column(Integer, default=0)
    silver = Column(Integer, default=0)
    bronze = Column(Integer, default=0)
    color = Column(String, default="bg-white")

class TrackEvent(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"))
    name = Column(String, index=True)
    event_type = Column(String) # TRACK or FIELD
    status = Column(String, default="PENDING")
    video_path = Column(String, nullable=True)
    finish_line_x = Column(Integer, default=560)
    distance_m = Column(Integer, default=100)
    photo_finish_path = Column(String, nullable=True)

class Entry(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(String, unique=True, index=True)
    athlete_name = Column(String)
    island = Column(String)
    event_name = Column(String)
    age_group = Column(String)
    age_check = Column(String, default="PASS")
    dup_check = Column(String, default="PASS")
    clash_check = Column(String, default="PASS")
    status = Column(String, default="PENDING")

class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    athlete_name = Column(String)
    island = Column(String)
    position = Column(Integer)
    mark = Column(String)
    reaction = Column(String, nullable=True)
    is_pb = Column(Boolean, default=False)
    new_record = Column(String, nullable=True)
    lane_or_order = Column(Integer, nullable=True)
    finish_timestamp = Column(String, nullable=True)
    average_speed = Column(String, nullable=True)
