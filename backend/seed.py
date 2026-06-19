from sqlalchemy.orm import Session
from . import models
from .database import engine, SessionLocal

def seed_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if we already seeded
    if db.query(models.Island).first():
        print("Database already seeded.")
        return

    # Seed Islands
    islands_data = [
        {"name": "KAVARATTI", "manager": "MOHAMMED K", "coach": "ALI HASSAN", "gold": 12, "silver": 8, "bronze": 5, "color": "bg-track-coral"},
        {"name": "AGATTI", "manager": "ABDUL RAHIM", "coach": "MUNEER", "gold": 10, "silver": 7, "bronze": 9, "color": "bg-track-lagoon"},
        {"name": "ANDROTH", "manager": "HAMEED", "coach": "SHABEER", "gold": 7, "silver": 11, "bronze": 8, "color": "bg-track-dark"},
        {"name": "MINICOY", "manager": "ISMAIL", "coach": "FAISAL", "gold": 5, "silver": 4, "bronze": 6, "color": "bg-track-foam"},
    ]
    for idata in islands_data:
        db.add(models.Island(**idata))
    
    # Seed Events
    events_data = [
        {"competition_id": 1, "name": "MEN'S 100M - HEAT 1", "event_type": "TRACK", "status": "PENDING"},
        {"competition_id": 1, "name": "WOMEN'S LONG JUMP - FINAL", "event_type": "FIELD", "status": "LIVE"},
    ]
    for edata in events_data:
        db.add(models.TrackEvent(**edata))
    
    # Seed Entries
    entries_data = [
        {"entry_id": "REQ-001", "athlete_name": "HIBA RAFI", "island": "KAVARATTI", "event_name": "WOMEN'S JAVELIN THROW", "age_group": "SENIOR WOMEN", "status": "PENDING"},
        {"entry_id": "REQ-002", "athlete_name": "MOHAMMED ALI", "island": "AGATTI", "event_name": "MEN'S 100M", "age_group": "UNDER-20 BOYS", "age_check": "FAIL", "status": "PENDING"},
        {"entry_id": "REQ-003", "athlete_name": "SARA NAJEEB", "island": "KADMAT", "event_name": "WOMEN'S SHOT PUT", "age_group": "UNDER-18 GIRLS", "status": "APPROVED"},
    ]
    for endata in entries_data:
        db.add(models.Entry(**endata))
    
    # Seed Results
    results_data = [
        {"event_id": 1, "athlete_name": "MARCUS JOHNSON", "island": "ANDROTH", "position": 1, "mark": "9.86s", "reaction": "0.142s", "is_pb": True, "new_record": "NATIONAL RECORD", "lane_or_order": 4},
        {"event_id": 1, "athlete_name": "ANDRE DE GRASSE", "island": "MINICOY", "position": 2, "mark": "9.89s", "reaction": "0.135s", "is_pb": False, "lane_or_order": 5},
        {"event_id": 2, "athlete_name": "SARAH CHEN", "island": "AMINI", "position": 1, "mark": "7.15m", "is_pb": True, "lane_or_order": 1},
        {"event_id": 2, "athlete_name": "MALAIIKA MIHAMBO", "island": "MINICOY", "position": 2, "mark": "7.02m", "is_pb": False, "lane_or_order": 2},
    ]
    for rdata in results_data:
        db.add(models.Result(**rdata))
    
    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
