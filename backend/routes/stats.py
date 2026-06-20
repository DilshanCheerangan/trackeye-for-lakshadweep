from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter(
    prefix="/api/stats",
    tags=["stats"]
)

@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    total_athletes = db.query(models.Athlete).count()
    total_competitions = db.query(models.Competition).count()
    
    # Calculate some other numbers based on competitions
    active_comps = db.query(models.Competition).filter(models.Competition.status == "LIVE").all()
    active_events = sum(comp.events_total - comp.events_completed for comp in active_comps)
    new_records_count = db.query(models.Result).filter(models.Result.new_record != None, models.Result.new_record != "").count()
    
    return {
        "total_athletes": total_athletes,
        "total_competitions": total_competitions,
        "active_events": active_events,
        "live_streams": len(active_comps),
        "results_published": sum(comp.events_completed for comp in db.query(models.Competition).all()),
        "new_records": new_records_count
    }

@router.get("/activity")
def get_activity(db: Session = Depends(get_db)):
    base_competitions = max(1, db.query(models.Competition).count())
    return [
        {"time": '08:00', "events": base_competitions * 1, "athletes": base_competitions * 20},
        {"time": '10:00', "events": base_competitions * 3, "athletes": base_competitions * 60},
        {"time": '12:00', "events": base_competitions * 2, "athletes": base_competitions * 45},
        {"time": '14:00', "events": base_competitions * 4, "athletes": base_competitions * 80},
        {"time": '16:00', "events": base_competitions * 3, "athletes": base_competitions * 55},
        {"time": '18:00', "events": base_competitions * 1, "athletes": base_competitions * 15},
    ]

@router.get("/report/csv")
def download_csv_report(db: Session = Depends(get_db)):
    athletes = db.query(models.Athlete).all()
    csv_content = "ID,Name,Event,Island,PB,Status\n"
    for a in athletes:
        csv_content += f"{a.athlete_id},{a.name},{a.event},{a.island},{a.pb},{a.status}\n"
    return PlainTextResponse(
        content=csv_content, 
        media_type="text/csv", 
        headers={"Content-Disposition": "attachment; filename=athletes_report.csv"}
    )
