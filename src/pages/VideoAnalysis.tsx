import { Upload, Video, ArrowRight, RotateCcw, AlertCircle, Pause, Play, SkipBack, SkipForward, Frame, Check, Crosshair, ZoomIn, ZoomOut, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VideoAnalysis() {
  const navigate = useNavigate();
  const enteredCompetitionId = sessionStorage.getItem('enteredCompetitionId');

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  
  // Video and Slit Scan States
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [finishLineX, setFinishLineX] = useState<number>(540);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slitScanData, setSlitScanData] = useState<any | null>(null);
  const [cursorX, setCursorX] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number>(0);
  
  // Playback Control States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [showOverlays, setShowOverlays] = useState(true);
  const [activeTab, setActiveTab] = useState("FRAME_BY_FRAME");
  
  // Athlete assignment
  const [selectedAthleteIndex, setSelectedAthleteIndex] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
  const STATIC_URL = API_URL.replace('/api', '');

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  // 1. Fetch Events
  useEffect(() => {
    if (!enteredCompetitionId) return;
    fetch(`${API_URL}/events/?competition_id=${enteredCompetitionId}&event_type=TRACK`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
          setSelectedEvent(data[0]);
        }
      })
      .catch(err => console.error("Error fetching events:", err));
  }, [enteredCompetitionId]);

  // 2. Fetch Selected Event Details & Results
  useEffect(() => {
    if (!selectedEventId) return;
    fetchResults();
    
    // Fetch individual event detail
    fetch(`${API_URL}/events/?competition_id=${enteredCompetitionId}&event_type=TRACK`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((e: any) => e.id === selectedEventId);
        if (found) {
          setSelectedEvent(found);
          setIsLocked(found.status === 'OFFICIAL');
          if (found.video_path) {
            setVideoUrl(`${STATIC_URL}${found.video_path}`);
          } else {
            setVideoUrl(null);
          }
          if (found.finish_line_x) {
            setFinishLineX(found.finish_line_x);
          }
          if (found.photo_finish_path) {
            // We have a pre-existing photo finish
            setSlitScanData({
              photo_finish_url: `${STATIC_URL}${found.photo_finish_path}`,
              fps: 30, // Fallback assumption
              total_frames: 240, // Fallback assumption
              width: 480, // Default width placeholder
              duration: 8.0
            });
            setActiveTab("PHOTO_FINISH");
          } else {
            setSlitScanData(null);
            setActiveTab("FRAME_BY_FRAME");
          }
        }
      })
      .catch(err => console.error(err));
  }, [selectedEventId]);

  const fetchResults = () => {
    if (!selectedEventId) return;
    fetch(`${API_URL}/events/${selectedEventId}/results`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((d: any) => ({
          id: d.id,
          pos: d.position,
          lane: d.lane_or_order,
          name: d.athlete_name,
          island: d.island,
          time: d.mark,
          pb: d.is_pb,
          newRecord: d.new_record,
          reaction: d.reaction || ""
        }));
        setResults(formatted);
      })
      .catch(err => console.error(err));
  };

  // Video timeupdate handler
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Video controls
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStep = (frames: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      const frameTime = 1 / 30; // standard 30fps
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + (frames * frameTime)));
    }
  };

  // Upload custom video
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedEventId) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("event_id", selectedEventId.toString());
    formData.append("file", file);

    setIsProcessing(true);
    setStatusMsg("UPLOADING VIDEO CLIP...");

    try {
      const response = await fetch(`${API_URL}/video/upload`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setVideoUrl(`${STATIC_URL}${data.video_path}`);
        setSlitScanData(null);
        setActiveTab("FRAME_BY_FRAME");
        setStatusMsg("VIDEO UPLOADED SUCCESSFULLY");
      } else {
        setStatusMsg("ERROR UPLOADING VIDEO");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("UPLOAD FAILED");
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate synthetic sample video
  const handleGenerateSample = async () => {
    if (!selectedEventId) return;
    setIsProcessing(true);
    setStatusMsg("GENERATING HIGH-SPEED SIMULATION VIDEO...");

    try {
      const response = await fetch(`${API_URL}/video/generate-sample`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ event_id: selectedEventId.toString() })
      });
      const data = await response.json();
      if (response.ok) {
        setVideoUrl(`${STATIC_URL}${data.video_path}`);
        setSlitScanData(null);
        setActiveTab("FRAME_BY_FRAME");
        setStatusMsg("SYNTHETIC SPRINT VIDEO READY");
      } else {
        setStatusMsg("GENERATION FAILED");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("GENERATION ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  // Click on video to set finish line X
  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoContainerRef.current) return;
    const rect = videoContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    // Map relative X coordinate based on actual video display size
    const widthPercentage = clickX / rect.width;
    // Assume 640 width in simulation
    const actualX = Math.round(widthPercentage * (videoRef.current?.videoWidth || 640));
    setFinishLineX(actualX);
  };

  // Process video to generate slit scan
  const handleProcessSlitScan = async () => {
    if (!selectedEventId) return;
    setIsProcessing(true);
    setStatusMsg("COMPUTING SLIT-SCAN PHOTO FINISH...");

    try {
      const response = await fetch(`${API_URL}/video/process-slit-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          event_id: selectedEventId.toString(),
          finish_line_x: finishLineX.toString()
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSlitScanData({
          photo_finish_url: `${STATIC_URL}${data.photo_finish_url}`,
          fps: data.fps,
          total_frames: data.total_frames,
          width: data.width,
          height: data.height,
          duration: data.duration
        });
        setActiveTab("PHOTO_FINISH");
        setStatusMsg("PHOTO FINISH GENERATED! USE SLIT-SCAN TIMING CURSOR");
      } else {
        setStatusMsg("SLIT-SCAN FAILURE");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("PROCESSING ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  // Click on Photo Finish to place timing cursor
  const handlePhotoClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!photoImgRef.current || !slitScanData) return;
    const rect = photoImgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const pixelX = ratio * slitScanData.width;
    setCursorX(pixelX);
    
    // Calculate precise time
    const frameIndex = (pixelX / slitScanData.width) * slitScanData.total_frames;
    const calculatedTime = frameIndex / slitScanData.fps;
    setHoverTime(calculatedTime);
  };

  // Adjust timing cursor by single frame increments (+ / -)
  const adjustCursorFrame = (frameOffset: number) => {
    if (!slitScanData || cursorX === null) return;
    const framePerPixel = slitScanData.total_frames / slitScanData.width;
    const pixelOffset = frameOffset / framePerPixel;
    
    let newCursorX = cursorX + pixelOffset;
    newCursorX = Math.max(0, Math.min(slitScanData.width, newCursorX));
    setCursorX(newCursorX);
    
    // Re-calculate time
    const frameIndex = (newCursorX / slitScanData.width) * slitScanData.total_frames;
    const calculatedTime = frameIndex / slitScanData.fps;
    setHoverTime(calculatedTime);
  };

  // Assign cursor time to selected athlete
  const handleAssignTime = () => {
    if (selectedAthleteIndex === null || hoverTime === 0) {
      setStatusMsg("ERROR: CHOOSE ATHLETE AND ALIGN TIME CURSOR");
      return;
    }
    const updated = [...results];
    updated[selectedAthleteIndex].time = `${hoverTime.toFixed(3)}s`;
    
    // Recalculate rank positions based on assigned times (sort ascending)
    const finished = updated.filter(r => r.time !== "-");
    finished.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    
    // Update positions
    updated.forEach(ath => {
      if (ath.time === "-") {
        ath.pos = 0;
      } else {
        const rank = finished.findIndex(f => f.id === ath.id);
        ath.pos = rank + 1;
      }
    });

    setResults(updated);
    setStatusMsg(`ASSIGNED ${hoverTime.toFixed(3)}s TO ${updated[selectedAthleteIndex].name}`);
  };

  // Save official standings to database
  const handleSaveResults = async () => {
    if (!selectedEventId) return;
    
    const payload = {
      event_id: selectedEventId,
      results: results.map(r => ({
        name: r.name,
        island: r.island,
        pos: r.pos,
        time: r.time,
        reaction: r.reaction || null,
        pb: r.pb,
        newRecord: r.newRecord || null,
        lane: r.lane
      }))
    };

    setIsProcessing(true);
    setStatusMsg("WRITING OFFICIAL STANDINGS TO DATABASE...");

    try {
      const response = await fetch(`${API_URL}/video/save-results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setIsLocked(true);
        setStatusMsg("STANDINGS OFFICIALLY VERIFIED & EVENT LOCKED");
      } else {
        setStatusMsg("DATABASE SAVE FAILED");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("PERSISTENCE ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset local adjustments
  const handleResetResults = () => {
    if (isLocked) return;
    const reset = results.map(r => ({ ...r, time: "-", pos: 0 }));
    setResults(reset);
    setCursorX(null);
    setHoverTime(0);
    setStatusMsg("LOCAL TIMING GRID RESET");
  };

  // If no competition has been entered
  if (!enteredCompetitionId) {
    return (
      <div className="py-20 px-4 max-w-2xl mx-auto text-center">
        <div className="brutal-card p-12 bg-white border-8 border-track-dark shadow-[12px_12px_0px_#FF7A45] flex flex-col items-center">
          <div className="w-24 h-24 bg-track-coral border-4 border-track-dark flex items-center justify-center transform -skew-x-12 mb-8 animate-bounce">
            <AlertCircle className="w-12 h-12 text-white stroke-[3]" />
          </div>
          <h1 className="text-5xl editorial-heading-bebas text-track-dark leading-none mb-4">NO MEET ACTIVE</h1>
          <p className="font-black text-track-dark/60 uppercase tracking-wider text-sm mb-8 max-w-md">
            You must enter an athletics meet from the Competitions panel to analyze race photo-finishes.
          </p>
          <button 
            onClick={() => navigate('/dashboard/competitions')} 
            className="flex items-center gap-3 bg-track-lagoon text-track-dark font-black text-xl uppercase px-8 py-4 border-4 border-track-dark shadow-[6px_6px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all transform -skew-x-6"
          >
            SELECT A MEET <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">VAR ANALYSIS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">
            {selectedEvent ? selectedEvent.name : "Official sprinter photo finish verification."}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          {statusMsg && (
            <div className="px-6 py-3 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6 text-sm">
              {statusMsg}
            </div>
          )}
          
          <select 
            value={selectedEventId || ""} 
            onChange={(e) => setSelectedEventId(parseInt(e.target.value) || null)}
            className="bg-white border-4 border-track-dark p-3 font-black text-sm uppercase tracking-wider cursor-pointer shadow-[4px_4px_0px_#010F1A] appearance-none"
          >
            {events.length === 0 ? (
              <option>No Track Events Found</option>
            ) : events.map(evt => (
              <option key={evt.id} value={evt.id}>{evt.name}</option>
            ))}
          </select>

          <button 
            onClick={handleResetResults}
            disabled={isLocked}
            className="brutal-button bg-white text-track-dark px-6 py-3 shadow-[4px_4px_0px_#010F1A] disabled:opacity-40"
          >
            <RotateCcw className="w-5 h-5 mr-2 stroke-[3]" />
            RESET TIMES
          </button>
          
          <button 
            onClick={handleSaveResults}
            disabled={isLocked || results.length === 0 || results.some(r => r.time === "-")} 
            className={`brutal-button ${isLocked ? 'bg-track-lagoon text-track-dark' : 'bg-track-coral text-white'} px-6 py-3 shadow-[4px_4px_0px_#010F1A] disabled:opacity-40`}
          >
            <Check className="w-5 h-5 mr-2 stroke-[3]" />
            {isLocked ? "STANDINGS LOCKED" : "VERIFY & LOCK RESULTS"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Interactive Video & Photo Finish Area */}
        <div className="xl:col-span-3 space-y-8">
          <div className="brutal-card p-4 bg-white border-4 border-track-dark">
            <div className="relative border-4 border-track-dark bg-track-dark overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className="flex border-b-4 border-track-dark bg-track-foam">
                <button 
                  onClick={() => setActiveTab("FRAME_BY_FRAME")} 
                  className={`flex-1 px-4 py-3 font-black uppercase tracking-widest transition-colors ${activeTab === "FRAME_BY_FRAME" ? "bg-track-lagoon text-track-dark" : "text-track-dark/60 hover:bg-track-dark/5"}`}
                >
                  1. FRAME VIEWER & FINISH LINE
                </button>
                <button 
                  onClick={() => {
                    if (slitScanData) setActiveTab("PHOTO_FINISH");
                    else setStatusMsg("GENERATE SLIT-SCAN FIRST!");
                  }} 
                  disabled={!slitScanData}
                  className={`flex-1 px-4 py-3 font-black uppercase tracking-widest transition-colors border-l-4 border-track-dark disabled:opacity-50 ${activeTab === "PHOTO_FINISH" ? "bg-track-coral text-white" : "text-track-dark/60 hover:bg-track-dark/5"}`}
                >
                  2. ADVANCED PHOTO FINISH
                </button>
              </div>

              {/* Tab Content 1: Frame Viewer */}
              {activeTab === "FRAME_BY_FRAME" && (
                <div className="relative min-h-[360px] flex flex-col items-center justify-center bg-[#010F1A]">
                  {isProcessing && (
                    <div className="absolute inset-0 z-40 bg-track-dark/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-4">
                      <Loader2 className="w-12 h-12 animate-spin text-track-lagoon" />
                      <span className="font-black uppercase tracking-widest text-lg">{statusMsg}</span>
                    </div>
                  )}

                  {videoUrl ? (
                    <div className="w-full relative flex flex-col items-center">
                      <div 
                        ref={videoContainerRef}
                        onClick={handleVideoClick}
                        className="relative max-w-full overflow-hidden cursor-crosshair border-b-4 border-track-dark"
                        style={{ width: '640px' }}
                      >
                        <video 
                          ref={videoRef}
                          src={videoUrl}
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          className="w-full h-auto object-contain block"
                          playsInline
                        />
                        
                        {/* Interactive Finish Line overlay */}
                        {showOverlays && (
                          <div 
                            className="absolute top-0 bottom-0 w-1 bg-track-coral shadow-[0_0_15px_rgba(255,122,69,1)] z-10 pointer-events-none"
                            style={{ 
                              left: `${(finishLineX / (videoRef.current?.videoWidth || 640)) * 100}%` 
                            }}
                          >
                            <div className="absolute top-4 -left-12 bg-track-coral border-2 border-white px-2 py-0.5 text-[10px] font-black text-white rounded">
                              FINISH LINE: {finishLineX}px
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Video Timing Controls */}
                      <div className="w-full bg-white p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleStep(-10)} className="brutal-button bg-track-foam p-3 shadow-[2px_2px_0px_#010F1A]">
                              <SkipBack className="w-4 h-4 stroke-[3]" />
                            </button>
                            <button onClick={handlePlayPause} className={`brutal-button p-3 ${isPlaying ? 'bg-track-coral text-white' : 'bg-track-foam'} shadow-[2px_2px_0px_#010F1A]`}>
                              {isPlaying ? <Pause className="w-4 h-4 stroke-[3]" /> : <Play className="w-4 h-4 stroke-[3]" />}
                            </button>
                            <button onClick={() => handleStep(10)} className="brutal-button bg-track-foam p-3 shadow-[2px_2px_0px_#010F1A]">
                              <SkipForward className="w-4 h-4 stroke-[3]" />
                            </button>
                            <button onClick={() => handleStep(1)} className="brutal-button bg-track-foam p-3 hover:bg-track-lagoon shadow-[2px_2px_0px_#010F1A]" title="Step 1 Frame">
                              <Frame className="w-4 h-4 stroke-[3]" />
                            </button>
                          </div>
                          
                          {/* Seek bar */}
                          <div className="flex-1 mx-6 relative flex items-center">
                            <input 
                              type="range"
                              min={0}
                              max={duration || 100}
                              step={0.01}
                              value={currentTime}
                              onChange={(e) => {
                                if (videoRef.current) videoRef.current.currentTime = parseFloat(e.target.value);
                              }}
                              className="w-full h-4 bg-track-foam border-2 border-track-dark rounded-none appearance-none cursor-pointer accent-track-coral"
                            />
                          </div>

                          <div className="font-black text-xl text-track-dark border-4 border-track-dark px-3 py-1 transform -skew-x-6 bg-track-foam">
                            {currentTime.toFixed(3)}s
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-track-dark/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-track-dark/60">FINISH LINE POSITION:</span>
                            <button onClick={() => setFinishLineX(x => Math.max(0, x - 2))} className="px-2 py-1 border-2 border-track-dark font-black text-xs hover:bg-track-foam">-2px</button>
                            <span className="font-black text-sm border-2 border-track-dark px-3 bg-track-foam">{finishLineX} px</span>
                            <button onClick={() => setFinishLineX(x => Math.min(videoRef.current?.videoWidth || 640, x + 2))} className="px-2 py-1 border-2 border-track-dark font-black text-xs hover:bg-track-foam">+2px</button>
                            <button 
                              onClick={() => setShowOverlays(!showOverlays)} 
                              className={`p-1 border-2 border-track-dark ml-2 hover:bg-track-foam transition-colors ${showOverlays ? 'bg-track-lagoon text-track-dark' : 'bg-white'}`}
                              title={showOverlays ? "Hide Overlay Line" : "Show Overlay Line"}
                            >
                              {showOverlays ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          <button 
                            onClick={handleProcessSlitScan}
                            className="flex items-center gap-2 bg-track-coral text-white font-black text-sm uppercase px-5 py-2 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A]"
                          >
                            <Crosshair className="w-4 h-4 stroke-[3]" /> PROCESS SLIT-SCAN PHOTO FINISH
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-white/50 flex flex-col items-center gap-6">
                      <Video className="w-16 h-16 stroke-[1.5]" />
                      <div>
                        <p className="font-black text-lg text-white uppercase tracking-widest mb-1">NO VIDEO CLIP LOADED FOR THIS HEAT</p>
                        <p className="text-sm font-bold text-white/40 uppercase">Upload race clip or generate a simulated demo sprint</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <label className="brutal-button bg-track-lagoon text-track-dark px-6 py-3 cursor-pointer shadow-[4px_4px_0px_#ffffff] hover:-translate-y-0.5 transition-transform flex items-center justify-center">
                          <Upload className="w-5 h-5 mr-2 stroke-[3]" />
                          UPLOAD VIDEO FILE (.MP4)
                          <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <button 
                          onClick={handleGenerateSample}
                          className="brutal-button bg-track-coral text-white px-6 py-3 shadow-[4px_4px_0px_#ffffff] hover:-translate-y-0.5 transition-transform"
                        >
                          GENERATE SAMPLE SPRINT VIDEO
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 2: Photo Finish slit-scan */}
              {activeTab === "PHOTO_FINISH" && slitScanData && (
                <div className="relative flex flex-col bg-white">
                  {/* Timing HUD */}
                  <div className="bg-track-dark text-white p-4 flex flex-wrap justify-between items-center border-b-4 border-track-dark gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-[10px] font-black text-track-lagoon uppercase tracking-widest block">CURSOR TIME</span>
                        <span className="font-bebas text-4xl leading-none text-track-coral">
                          {hoverTime > 0 ? `${hoverTime.toFixed(3)}s` : "ALIGN CURSOR"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block">CORRESPONDING FRAME</span>
                        <span className="font-black text-xl text-white">
                          {cursorX !== null 
                            ? `#${Math.round((cursorX / slitScanData.width) * slitScanData.total_frames)} / ${slitScanData.total_frames}` 
                            : "CLICK IMAGE"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => adjustCursorFrame(-1)} className="px-2 py-1 border-2 border-white font-black text-xs hover:bg-white/10" title="Back 1 frame">
                        -1 FR
                      </button>
                      <button onClick={() => adjustCursorFrame(1)} className="px-2 py-1 border-2 border-white font-black text-xs hover:bg-white/10" title="Forward 1 frame">
                        +1 FR
                      </button>
                      <button onClick={() => setPhotoZoom(z => Math.min(z + 0.25, 2.5))} className="p-1 border-2 border-white hover:bg-white/10 ml-2" title="Zoom In">
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button onClick={() => setPhotoZoom(z => Math.max(z - 0.25, 0.75))} className="p-1 border-2 border-white hover:bg-white/10" title="Zoom Out">
                        <ZoomOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scrollable image */}
                  <div 
                    ref={photoContainerRef}
                    className="overflow-x-auto overflow-y-hidden bg-[#0a0a0a] min-h-[300px] border-b-4 border-track-dark relative"
                  >
                    <div 
                      className="relative inline-block"
                      style={{ 
                        transform: `scaleY(${photoZoom})`, 
                        transformOrigin: 'top left',
                        height: '360px'
                      }}
                    >
                      <img 
                        ref={photoImgRef}
                        src={slitScanData.photo_finish_url} 
                        alt="Slit Scan Photo Finish" 
                        className="h-[360px] max-w-none block cursor-crosshair"
                        onClick={handlePhotoClick}
                        style={{
                          width: `${slitScanData.width * (photoZoom > 1 ? photoZoom : 1)}px`
                        }}
                      />
                      
                      {/* Vertical timing line overlay */}
                      {cursorX !== null && (
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-red-600 shadow-[0_0_10px_red] z-20 pointer-events-none"
                          style={{ 
                            left: `${cursorX * (photoZoom > 1 ? photoZoom : 1)}px` 
                          }}
                        >
                          <div className="absolute top-0 -left-6 bg-red-600 text-white font-black text-[9px] px-1 py-0.5 rounded shadow">
                            {hoverTime.toFixed(3)}s
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guide text */}
                  <div className="p-4 bg-track-foam/30 flex items-center gap-3">
                    <Crosshair className="w-5 h-5 text-track-coral shrink-0" />
                    <p className="text-xs font-bold text-track-dark/70 uppercase">
                      <b className="text-track-dark font-black">HOW TO TIME:</b> CLICK ON THE IMAGE WHERE AN ATHLETE'S TORSO (NOT HANDS/FEET) TOUCHES THE FINISH STITCH. ADJUST PRECISELY BY USING THE FRAME STEP BUTTONS (-1 FR / +1 FR). THEN CLICK "ASSIGN TIME" IN THE SIDEBAR.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Timing Grid / Athlete Standings List */}
        <div className="space-y-8">
          <div className="brutal-card p-0 flex flex-col border-4 border-track-dark h-full">
            <div className="p-4 border-b-8 border-track-dark bg-track-coral">
              <h3 className="font-black text-3xl editorial-heading-bebas text-white">TIMING CONSOLE</h3>
            </div>
            
            <div className="p-4 bg-white flex-1 flex flex-col">
              <span className="text-xs font-black uppercase text-track-dark/60 tracking-wider mb-2 block">
                SELECT ATHLETE & CHOOSE CORRESPONDING FINISH
              </span>
              
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1 mb-4 flex-1">
                {results.length === 0 ? (
                  <div className="text-center font-bold text-track-dark/40 py-8 uppercase text-xs">
                    NO ATHLETES REGISTERED
                  </div>
                ) : (
                  results.map((result, idx) => (
                    <div 
                      key={result.id} 
                      onClick={() => !isLocked && setSelectedAthleteIndex(idx)}
                      className={`flex items-center gap-3 p-3 border-4 border-track-dark cursor-pointer transition-all ${
                        selectedAthleteIndex === idx 
                          ? 'bg-track-lagoon shadow-[2px_2px_0px_#010F1A]' 
                          : result.time !== "-" 
                            ? 'bg-track-foam/40' 
                            : 'bg-white hover:bg-track-foam/25'
                      }`}
                    >
                      <div className="w-6 h-6 bg-track-dark text-white flex items-center justify-center font-black text-xs transform -skew-x-6">
                        {result.lane}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="font-black text-track-dark uppercase text-xs truncate mr-1">
                            {result.name}
                          </span>
                          <span className="font-black text-sm shrink-0">
                            {result.time === "-" ? "PENDING" : result.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-track-dark/50 mt-0.5">
                          <span>{result.island}</span>
                          {result.pos > 0 && <span className="font-black text-track-coral">POS: {result.pos}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Assignment action */}
              <div className="border-t-4 border-track-dark pt-4 mt-auto">
                {selectedAthleteIndex !== null ? (
                  <div className="space-y-3">
                    <div className="bg-track-foam p-3 border-2 border-track-dark">
                      <span className="text-[10px] font-black text-track-dark/50 uppercase tracking-widest block">TARGET ATHLETE</span>
                      <span className="font-black text-md text-track-dark uppercase">
                        {results[selectedAthleteIndex].name} (LANE {results[selectedAthleteIndex].lane})
                      </span>
                    </div>

                    <button 
                      onClick={handleAssignTime}
                      disabled={isLocked || hoverTime === 0}
                      className="w-full bg-track-dark text-white font-black text-sm uppercase py-3 border-4 border-track-dark shadow-[4px_4px_0px_#FF7A45] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-40"
                    >
                      ASSIGN {hoverTime > 0 ? `${hoverTime.toFixed(3)}s` : "CURSOR TIME"}
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-track-foam/20 border-2 border-dashed border-track-dark/40 text-center font-black text-xs text-track-dark/50 uppercase">
                    CHOOSE ATHLETE FROM LIST ABOVE TO ASSIGN TIME
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
