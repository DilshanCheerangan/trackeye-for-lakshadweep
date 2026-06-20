from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from . import models
from .database import engine
from .routes import athletes, competitions, ws, video, stats, islands, entries, events

# Create database tables and uploads directory
models.Base.metadata.create_all(bind=engine)
os.makedirs("backend/uploads", exist_ok=True)

app = FastAPI(title="TrackEye Backend API")
app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")


# Setup CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins in production, or specify your hosted domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(athletes.router)
app.include_router(competitions.router)
app.include_router(ws.router)
app.include_router(video.router)
app.include_router(stats.router)
app.include_router(islands.router)
app.include_router(entries.router)
app.include_router(events.router)

@app.get("/")
def read_root():
    return {"message": "TrackEye Backend is running"}
