from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from ..vision.tracker import generate_frames
from ..database import SessionLocal
from .. import models
import random
import os
import shutil

try:
    import cv2
    import numpy as np
except ImportError:
    cv2 = None
    np = None

router = APIRouter(
    prefix="/api/video",
    tags=["video"]
)

@router.get("/feed")
def video_feed():
    """
    Returns a multipart stream of JPEG frames annotated by YOLO.
    Can be used directly in an HTML <img> tag's src attribute.
    """
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@router.get("/var-results")
def get_var_results():
    db = SessionLocal()
    try:
        athletes = db.query(models.Athlete).limit(8).all()
    finally:
        db.close()
    
    if not athletes:
        return []
        
    results = []
    base_time = 9.85
    for i, ath in enumerate(athletes):
        finish_time = base_time + (i * 0.04) + random.uniform(-0.01, 0.03)
        results.append({
            "pos": 0,
            "lane": i + 1,
            "name": ath.name,
            "time": f"{finish_time:.3f}",
            "diff": f"+{(finish_time - base_time):.3f}" if i > 0 else "-"
        })
    
    results.sort(key=lambda x: float(x["time"]))
    base_winner = float(results[0]["time"])
    for i, res in enumerate(results):
        res["pos"] = i + 1
        if i == 0:
            res["diff"] = "-"
        else:
            res["diff"] = f"+{(float(res['time']) - base_winner):.3f}"
            
    return results

@router.post("/upload")
def upload_video(event_id: int = Form(...), file: UploadFile = File(...)):
    os.makedirs("backend/uploads", exist_ok=True)
    ext = file.filename.split(".")[-1]
    filename = f"video_{event_id}.{ext}"
    file_path = os.path.join("backend/uploads", filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db = SessionLocal()
    video_path_url = f"/uploads/{filename}"
    try:
        event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
        if event:
            event.video_path = video_path_url
            db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database update failed: {e}")
    finally:
        db.close()
        
    return {"message": "Video uploaded successfully", "video_path": video_path_url}

@router.post("/generate-sample")
def generate_sample_video(event_id: int = Form(...)):
    os.makedirs("backend/uploads", exist_ok=True)
    filename = f"video_{event_id}.mp4"
    video_path = os.path.join("backend/uploads", filename)
    
    db = SessionLocal()
    try:
        db_results = db.query(models.Result).filter(models.Result.event_id == event_id).all()
        # Sort by lane order
        db_results.sort(key=lambda x: x.lane_or_order or 1)
        athlete_names = [r.athlete_name for r in db_results]
        athlete_islands = [r.island for r in db_results]
    except Exception as e:
        print(f"Failed to fetch athletes for sample video: {e}")
        athlete_names = []
        athlete_islands = []
    finally:
        db.close()
        
    if not athlete_names:
        athlete_names = ["MUBASSINA MOHAMMED", "MUNSIRA MUNEER", "NIHALA K.K.", "MOHAMMED SAFWAN", "FATHIMA SHIRIN", "MARCUS JOHNSON"]
        athlete_islands = ["KAVARATTI", "AGATTI", "AMINI", "ANDROTH", "KALPENI", "MINICOY"]
        
    num_athletes = min(8, len(athlete_names))
    
    if cv2 is None or np is None:
        raise HTTPException(status_code=500, detail="OpenCV or Numpy not available in the backend.")
        
    width, height = 640, 360
    fps = 30
    total_frames = 240 # 8 seconds of simulation
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
    
    if not out.isOpened():
        # Fallback to MJPG codec
        fourcc = cv2.VideoWriter_fourcc(*'MJPG')
        out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
        
    if not out.isOpened():
        raise HTTPException(status_code=500, detail="Failed to initialize VideoWriter.")
        
    # We want them to cross the finish line at x=540
    # Starting at x=60. Distance to cover = 480 pixels.
    # We want them to cross between frame 150 (5s) and frame 210 (7s).
    # Avg speed needed = 480 / crossing_frame.
    # E.g., crossing frame 160 => speed = 3.0 px/frame
    crossing_frames = [random.uniform(160, 205) for _ in range(num_athletes)]
    # Sort them to assign random but consistent crossing order
    crossing_frames.sort()
    
    # Calculate exact speed for each runner to cross at their designated frame
    speeds = [480.0 / cf for cf in crossing_frames]
    # Add minor noise per frame later, but starting position is x=60
    positions = [60.0] * num_athletes
    
    colors = [
        (69, 122, 255),   # Coral
        (200, 200, 0),    # Teal/Lagoon
        (0, 165, 255),    # Orange
        (0, 200, 100),    # Green
        (255, 100, 0),    # Blue
        (100, 0, 255),    # Purple
        (255, 0, 255),    # Pink
        (0, 255, 255)     # Yellow
    ]
    
    lane_height = 35
    start_y = 50
    
    for frame_idx in range(total_frames):
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        frame[:] = (26, 15, 1) # Dark background
        
        # Finish line
        cv2.line(frame, (540, 0), (540, height), (69, 122, 255), 4)
        cv2.putText(frame, "FINISH", (510, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (69, 122, 255), 1)
        
        # Start line
        cv2.line(frame, (60, 0), (60, height), (255, 255, 255), 2)
        
        for i in range(num_athletes):
            y = start_y + i * lane_height + 15
            cv2.line(frame, (0, start_y + i * lane_height), (width, start_y + i * lane_height), (40, 40, 40), 1)
            
            # Update position
            # Add minor random noise to speed to make it look organic
            noise = random.uniform(-0.15, 0.15)
            # Cap speed to prevent going backwards or moving too fast
            current_speed = max(0.5, speeds[i] + noise)
            
            if positions[i] < width:
                positions[i] += current_speed
                
            x = int(positions[i])
            
            # Draw athlete torso (circle)
            cv2.circle(frame, (x, y), 8, colors[i % len(colors)], -1)
            cv2.circle(frame, (x, y), 8, (255, 255, 255), 1)
            
            # Label
            cv2.putText(frame, f"L{i+1}: {athlete_names[i].split()[0]}", (x - 20, y - 12), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 255), 1)
                        
        out.write(frame)
        
    out.release()
    
    db = SessionLocal()
    video_path_url = f"/uploads/{filename}"
    try:
        event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
        if event:
            event.video_path = video_path_url
            db.commit()
    except Exception as e:
        db.rollback()
    finally:
        db.close()
        
    return {"message": "Sample video generated successfully", "video_path": video_path_url}

@router.post("/process-slit-scan")
def process_slit_scan(event_id: int = Form(...), finish_line_x: int = Form(540)):
    db = SessionLocal()
    video_rel_path = None
    try:
        event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
        if event:
            event.finish_line_x = finish_line_x
            db.commit()
            video_rel_path = event.video_path
    finally:
        db.close()
        
    if not video_rel_path:
        video_rel_path = f"/uploads/video_{event_id}.mp4"
        
    video_filename = video_rel_path.split("/")[-1]
    video_path = os.path.join("backend/uploads", video_filename)
    
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video file not found. Generate or upload video first.")
        
    if cv2 is None or np is None:
        raise HTTPException(status_code=500, detail="OpenCV or Numpy not available.")
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open video file.")
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30.0
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    if finish_line_x < 0 or finish_line_x >= width:
        finish_line_x = 540
        
    slice_width = 2
    columns = []
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        x_start = max(0, finish_line_x - slice_width // 2)
        x_end = min(width, x_start + slice_width)
        
        column = frame[:, x_start:x_end]
        if column.shape[1] > 0:
            columns.append(column)
            
        frame_count += 1
        if frame_count >= 1500: # Cap at 50 seconds to prevent huge files
            break
            
    cap.release()
    
    if not columns:
        raise HTTPException(status_code=500, detail="No frames were processed.")
        
    photo_finish_img = np.concatenate(columns, axis=1)
    
    photo_finish_filename = f"photo_finish_{event_id}.jpg"
    photo_finish_path = os.path.join("backend/uploads", photo_finish_filename)
    cv2.imwrite(photo_finish_path, photo_finish_img)
    
    photo_finish_url = f"/uploads/{photo_finish_filename}"
    db = SessionLocal()
    try:
        event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
        if event:
            event.photo_finish_path = photo_finish_url
            db.commit()
    finally:
        db.close()
        
    return {
        "photo_finish_url": photo_finish_url,
        "fps": fps,
        "total_frames": frame_count,
        "slice_width": slice_width,
        "width": photo_finish_img.shape[1],
        "height": photo_finish_img.shape[0],
        "duration": frame_count / fps
    }

@router.post("/save-results")
def save_results(payload: dict):
    event_id = payload.get("event_id")
    results = payload.get("results")
    
    if not event_id or results is None:
        raise HTTPException(status_code=400, detail="Missing event_id or results.")
        
    db = SessionLocal()
    try:
        event = db.query(models.TrackEvent).filter(models.TrackEvent.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
            
        # Delete old results
        db.query(models.Result).filter(models.Result.event_id == event_id).delete()
        
        # Add new results
        for r in results:
            db_res = models.Result(
                event_id=event_id,
                athlete_name=r.get("name"),
                island=r.get("island", "KAVARATTI"),
                position=r.get("pos"),
                mark=r.get("time"),
                reaction=r.get("reaction") or None,
                is_pb=bool(r.get("pb")),
                new_record=r.get("newRecord") or None,
                lane_or_order=r.get("lane")
            )
            db.add(db_res)
            
        event.status = "OFFICIAL"
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database transaction failed: {e}")
    finally:
        db.close()
        
    return {"message": "Standings saved successfully and event marked as OFFICIAL."}

