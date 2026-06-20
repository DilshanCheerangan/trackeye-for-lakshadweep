from sqlalchemy.orm import Session
from . import models
from .database import engine, SessionLocal

def seed_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear all tables first to guarantee absolute fresh state
    db.query(models.Result).delete()
    db.query(models.TrackEvent).delete()
    db.query(models.Entry).delete()
    db.query(models.Athlete).delete()
    db.query(models.Competition).delete()
    db.query(models.Island).delete()
    db.commit()

    # Seed Islands
    islands_data = [
        {"name": "KAVARATTI", "manager": "MOHAMMED K", "coach": "ALI HASSAN", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-track-coral"},
        {"name": "AGATTI", "manager": "ABDUL RAHIM", "coach": "MUNEER", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-track-lagoon"},
        {"name": "ANDROTH", "manager": "HAMEED", "coach": "SHABEER", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-track-dark"},
        {"name": "MINICOY", "manager": "ISMAIL", "coach": "FAISAL", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-track-foam"},
        {"name": "AMINI", "manager": "SHAREEF", "coach": "KHALID", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-white"},
        {"name": "KADMAT", "manager": "RASHEED", "coach": "SAYED", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-white"},
        {"name": "KALPENI", "manager": "USMAN", "coach": "KOYA", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-white"},
        {"name": "KILTAN", "manager": "POCKER", "coach": "ATTA", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-white"},
        {"name": "CHETLAT", "manager": "KIDAVE", "coach": "MUTHU", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-white"},
        {"name": "BITRA", "manager": "BAPPU", "coach": "CHERIYA", "gold": 0, "silver": 0, "bronze": 0, "color": "bg-white"},
    ]
    for idata in islands_data:
        db.add(models.Island(**idata))
    
    db.commit()
    db.close()
    print("Clean database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
