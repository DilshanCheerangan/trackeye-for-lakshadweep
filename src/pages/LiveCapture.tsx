import { Camera, Maximize, AlertTriangle, Play, Smartphone, Zap, Save, Video, Square, Upload, Loader2, ArrowRight, AlertCircle, RotateCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LiveCapture() {
  const navigate = useNavigate();
  const enteredCompetitionId = sessionStorage.getItem('enteredCompetitionId');

  const [toast, setToast] = useState("");
  const [liveSpeed, setLiveSpeed] = useState<number>(38.2);
  const [liveEvent, setLiveEvent] = useState<string>("MEN'S 100M FINAL");

  const [fps, setFps] = useState("120 FPS");
  const [startMode, setStartMode] = useState("AI GUN DETECTION");
  const [autoStorage, setAutoStorage] = useState(true);

  // Feed Toggle & Webcam States
  const [feedMode, setFeedMode] = useState<"BACKEND_AI" | "LOCAL_RECORDER">("LOCAL_RECORDER");
  const [feedSrc, setFeedSrc] = useState<string>(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/video/feed`);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Events list for saving recorded clip
  const [events, setEvents] = useState<any[]>([]);
  const [targetEventId, setTargetEventId] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch track events for binding recording
  useEffect(() => {
    if (!enteredCompetitionId) return;
    fetch(`${API_URL}/events/?competition_id=${enteredCompetitionId}&event_type=TRACK`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        if (data.length > 0) {
          setTargetEventId(data[0].id);
        }
      })
      .catch(err => console.error("Error fetching events:", err));
  }, [enteredCompetitionId]);

  // Handle WebSocket live metrics
  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:8001/ws'}/live-metrics`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLiveSpeed(data.leader_speed_kmh);
      if (data.event) setLiveEvent(data.event);
    };

    return () => ws.close();
  }, []);

  // Set up local webcam stream if LOCAL_RECORDER is selected
  useEffect(() => {
    if (feedMode === "LOCAL_RECORDER") {
      startWebcam(facingMode);
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [feedMode, facingMode]);

  const startWebcam = async (mode: "user" | "environment" = facingMode) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }, 
          frameRate: { ideal: 60 },
          facingMode: { ideal: mode } 
        },
        audio: true
      });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Webcam access denied or unavailable:", err);
      setToast("CAMERA ACCESS ERROR");
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const handleFeedError = () => {
    setFeedSrc("https://images.unsplash.com/photo-1522850937840-0a256a4b1307?auto=format&fit=crop&q=80&w=1200");
  };

  // Recording Logic
  const handleStartRecording = () => {
    if (!streamRef.current) {
      setToast("CAMERA NOT READY");
      return;
    }
    
    chunksRef.current = [];
    
    // Choose appropriate mimeType (mp4 fallback to webm)
    let options = { mimeType: 'video/webm;codecs=vp9,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm;codecs=vp8,opus' };
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm' };
    }

    try {
      const recorder = new MediaRecorder(streamRef.current, options);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setToast("RECORDING CAPTURED");
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); // chunk every 100ms
      setIsRecording(true);
      setRecordingSeconds(0);
      setRecordedBlob(null);

      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start MediaRecorder:", err);
      setToast("RECORDING FAILED TO START");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTimer = (secs: number) => {
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Upload recorded blob to event and navigate to VAR
  const handleUploadRecording = async () => {
    if (!recordedBlob || !targetEventId) {
      setToast("NO RECORDING OR EVENT CHOSEN");
      return;
    }

    setIsUploading(true);
    setToast("UPLOADING RACE RECORDING...");

    const file = new File([recordedBlob], `recorded_race_${targetEventId}.webm`, { type: 'video/webm' });
    const formData = new FormData();
    formData.append("event_id", targetEventId.toString());
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/video/upload`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        setToast("UPLOAD SUCCESSFUL");
        // Redirect to analysis page with event selected
        setTimeout(() => {
          navigate(`/dashboard/video-analysis`);
        }, 1000);
      } else {
        setToast("UPLOAD FAILED");
      }
    } catch (err) {
      console.error(err);
      setToast("NETWORK UPLOAD ERROR");
    } finally {
      setIsUploading(false);
    }
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
            You must enter a competition/meet from the Competitions panel to record live race feeds.
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
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">LIVE CAPTURE HUD</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">
            {liveEvent} • Recording & AI Stream routing
          </p>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] bg-white">
          <button 
            onClick={() => setFeedMode("LOCAL_RECORDER")} 
            className={`px-4 py-2 font-black text-xs uppercase tracking-wider transition-colors ${feedMode === "LOCAL_RECORDER" ? "bg-track-lagoon text-track-dark" : "text-track-dark/60"}`}
          >
            Webcam Recorder
          </button>
          <button 
            onClick={() => setFeedMode("BACKEND_AI")} 
            className={`px-4 py-2 font-black text-xs uppercase tracking-wider transition-colors border-l-4 border-track-dark ${feedMode === "BACKEND_AI" ? "bg-track-coral text-white" : "text-track-dark/60"}`}
          >
            YOLO AI Stream
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="brutal-card p-2 bg-track-dark relative">
            <div className="aspect-video bg-black relative overflow-hidden border-4 border-track-dark flex items-center justify-center">
              
              {/* Mode A: Local Webcam Recorder */}
              {feedMode === "LOCAL_RECORDER" && (
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`} // mirror webcam output for front camera only
                />
              )}

              {/* Mode B: Live camera / simulation feed */}
              {feedMode === "BACKEND_AI" && (
                <img 
                  src={feedSrc} 
                  onError={handleFeedError}
                  alt="Track Feed" 
                  className="w-full h-full object-cover opacity-90"
                />
              )}
              
              {/* CV Simulation Overlay (only for backend AI) */}
              {feedMode === "BACKEND_AI" && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-20 left-1/4 w-32 h-48 border-4 border-track-lagoon shadow-[0_0_15px_rgba(0,200,200,0.5)]">
                    <span className="absolute -top-8 left-0 bg-track-lagoon text-track-dark text-xs font-black px-2 py-1 uppercase">
                      Lane 4 : {liveSpeed.toFixed(1)} km/h
                    </span>
                  </div>
                  <div className="absolute top-24 left-1/3 w-32 h-48 border-4 border-track-coral shadow-[0_0_15px_rgba(255,122,69,0.5)]">
                    <span className="absolute -top-8 left-0 bg-track-coral text-white text-xs font-black px-2 py-1 uppercase">
                      Lane 5 : {(liveSpeed - 0.8).toFixed(1)} km/h
                    </span>
                  </div>
                </div>
              )}

              {/* Recording Status Overlay */}
              {feedMode === "LOCAL_RECORDER" && isRecording && (
                <div className="absolute top-4 left-4 bg-track-coral border-2 border-white text-white font-black text-sm px-4 py-2 animate-pulse flex items-center gap-2 rounded">
                  <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                  REC {formatTimer(recordingSeconds)}
                </div>
              )}

              {/* Camera HUD */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-end bg-gradient-to-t from-track-dark/90 to-transparent gap-2">
                <div className="flex flex-wrap gap-2 max-w-[70%]">
                  <div className="bg-white px-2 py-0.5 md:px-3 md:py-1 font-black text-track-dark text-[10px] md:text-xs uppercase border-l-4 border-track-lagoon">
                    {feedMode === "LOCAL_RECORDER" ? "BROWSER WEBCAM" : "AI DETECTOR"}
                  </div>
                  <div className="bg-white px-2 py-0.5 md:px-3 md:py-1 font-black text-track-dark text-[10px] md:text-xs uppercase border-l-4 border-track-foam">
                    {fps}
                  </div>
                  <div className="bg-white px-2 py-0.5 md:px-3 md:py-1 font-black text-track-dark text-[10px] md:text-xs uppercase border-l-4 border-track-coral">
                    CV HUD ACTIVE
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {feedMode === "LOCAL_RECORDER" && (
                    <button 
                      onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")} 
                      title="Switch Camera"
                      className="p-2 bg-white/10 hover:bg-white text-white hover:text-track-dark transition-colors border-2 border-white/20 flex items-center justify-center gap-1 font-black text-[10px] md:text-xs uppercase"
                    >
                      <RotateCw className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline">{facingMode === "user" ? "BACK CAM" : "FRONT CAM"}</span>
                    </button>
                  )}
                  <button onClick={() => { try { document.documentElement.requestFullscreen(); } catch(e) {} }} className="p-2 bg-white/10 hover:bg-white text-white hover:text-track-dark transition-colors border-2 border-white/20">
                    <Maximize className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 px-2 pb-2 gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                {toast && <div className="px-4 py-2 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6 text-sm">{toast}</div>}
                
                {feedMode === "LOCAL_RECORDER" ? (
                  <>
                    {!isRecording ? (
                      <button 
                        onClick={handleStartRecording} 
                        className="brutal-button bg-track-coral text-white px-5 py-2 text-sm shadow-[4px_4px_0px_#010F1A]"
                      >
                        <Video className="w-4 h-4 mr-2 stroke-[3]" />
                        START RECORDING
                      </button>
                    ) : (
                      <button 
                        onClick={handleStopRecording} 
                        className="brutal-button bg-red-600 text-white px-5 py-2 text-sm shadow-[4px_4px_0px_#010F1A] animate-pulse"
                      >
                        <Square className="w-4 h-4 mr-2 stroke-[3]" />
                        STOP RECORDING
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={() => setToast("FRAME SAVED TO REPORTS")} className="brutal-button bg-track-coral text-white px-4 py-2 text-sm shadow-[4px_4px_0px_#010F1A]">
                      <Camera className="w-4 h-4 mr-2 stroke-[3]" />
                      Capture Frame
                    </button>
                    <button onClick={() => setToast("REPLAYING BUFFER")} className="brutal-button bg-white text-track-dark px-4 py-2 text-sm shadow-[4px_4px_0px_#010F1A]">
                      <Play className="w-4 h-4 mr-2 stroke-[3]" />
                      Replay Last 5s
                    </button>
                  </>
                )}
                
                <button onClick={() => setStartMode(startMode === "MANUAL START" ? "AI GUN DETECTION" : "MANUAL START")} className={`brutal-button px-4 py-2 text-sm shadow-[4px_4px_0px_#010F1A] ${startMode === 'MANUAL START' ? 'bg-track-lagoon text-track-dark' : 'bg-track-dark text-white'}`}>
                  <Zap className="w-4 h-4 mr-2 stroke-[3]" />
                  {startMode === "MANUAL START" ? "MANUAL START" : "AI GUN: ARMED"}
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-track-lagoon shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[3]" />
                <span className="text-sm font-black uppercase tracking-widest">Wind: +1.2 m/s</span>
              </div>
            </div>
          </div>

          {/* Section to Bind and Upload Recorded video */}
          {feedMode === "LOCAL_RECORDER" && recordedBlob && (
            <div className="brutal-card p-6 bg-white border-4 border-track-dark shadow-[6px_6px_0px_#010F1A] space-y-4">
              <h3 className="font-black text-2xl uppercase tracking-widest text-track-dark border-l-4 border-track-coral pl-3">
                STEP 2: BIND RECORDING TO TRACK EVENT
              </h3>
              <p className="text-xs font-bold text-track-dark/60 uppercase">
                A video file has been successfully captured. Select the target event below to upload this clip for VAR photo-finish analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <select 
                  value={targetEventId || ""}
                  onChange={(e) => setTargetEventId(parseInt(e.target.value) || null)}
                  className="bg-track-foam border-4 border-track-dark p-3 font-black text-sm uppercase flex-1"
                >
                  {events.length === 0 ? (
                    <option>No events registered</option>
                  ) : events.map(evt => (
                    <option key={evt.id} value={evt.id}>{evt.name}</option>
                  ))}
                </select>

                <button 
                  onClick={handleUploadRecording}
                  disabled={isUploading || !targetEventId}
                  className="bg-track-lagoon text-track-dark font-black text-sm uppercase px-6 py-4 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      UPLOADING...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 stroke-[3]" />
                      UPLOAD & GO TO VAR ANALYSIS
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="brutal-card p-0 flex flex-col">
            <div className="p-4 border-b-8 border-track-dark bg-track-lagoon flex justify-between items-center">
              <h3 className="font-black text-2xl editorial-heading-bebas text-track-dark">CAMERA SETUP</h3>
              <Smartphone className="w-6 h-6 text-track-dark" />
            </div>
            <div className="p-6 space-y-4 bg-white">
              {feedMode === "LOCAL_RECORDER" && (
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Active Camera</label>
                  <select 
                    value={facingMode} 
                    onChange={(e) => setFacingMode(e.target.value as "user" | "environment")} 
                    className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase cursor-pointer"
                  >
                    <option value="environment">Back Camera (Rear-facing)</option>
                    <option value="user">Front Camera (Selfie-facing)</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Capture FPS</label>
                <select value={fps} onChange={(e) => setFps(e.target.value)} className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase cursor-pointer">
                  <option value="60 FPS">60 FPS (Standard Mobile)</option>
                  <option value="120 FPS">120 FPS (High Speed)</option>
                  <option value="240 FPS">240 FPS (Slo-Mo)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Start Detection Mode</label>
                <select value={startMode} onChange={(e) => setStartMode(e.target.value)} className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase cursor-pointer">
                  <option value="AI GUN DETECTION">AI Gun Detection (Audio)</option>
                  <option value="MANUAL START">Manual Start</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t-4 border-track-dark/10">
                <span className="text-sm font-black text-track-dark uppercase">Auto Storage</span>
                <button 
                  onClick={() => setAutoStorage(!autoStorage)}
                  className={`relative inline-flex h-6 w-11 items-center border-2 border-track-dark ${autoStorage ? 'bg-track-coral' : 'bg-track-foam'}`}
                >
                  <span className={`inline-block h-4 w-4 transform bg-white transition ${autoStorage ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {autoStorage && (
                <div className="flex items-center gap-2 text-xs font-black text-track-dark/60 uppercase mt-2">
                  <Save className="w-3 h-3" />
                  Saving to Cloud Database
                </div>
              )}
            </div>
          </div>

          <div className="brutal-card p-0 flex flex-col border-4 border-track-dark shadow-[4px_4px_0px_#010F1A]">
            <div className="p-4 border-b-8 border-track-dark bg-track-foam">
              <h3 className="font-black text-2xl editorial-heading-bebas text-track-dark">CAMERA INSTRUCTIONS</h3>
            </div>
            <div className="p-5 space-y-3 bg-white flex-1 text-[11px] font-bold text-track-dark/80">
              <p className="border-l-4 border-track-coral pl-2 uppercase font-black text-track-dark">
                How to record and analyze a race:
              </p>
              <ol className="list-decimal list-inside space-y-2 uppercase leading-relaxed">
                <li>Ensure <span className="bg-track-lagoon text-track-dark px-1">Webcam Recorder</span> mode is selected in the top right.</li>
                <li>Accept camera and microphone permissions when requested by the browser.</li>
                <li>Align the camera lens perpendicular to the finish line on the track.</li>
                <li>Click <span className="text-track-coral font-black">START RECORDING</span> when the starting gun fires.</li>
                <li>Click <span className="text-red-600 font-black">STOP RECORDING</span> once all athletes have crossed the line.</li>
                <li>Select your event, then click <span className="bg-track-lagoon text-track-dark px-1.5 font-black">UPLOAD & GO TO VAR</span> to open the timing console.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
