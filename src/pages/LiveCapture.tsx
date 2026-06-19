import { Camera, Maximize, AlertTriangle, Play, Smartphone, Zap, Save, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LiveCapture() {
  const [cameraStatus, setCameraStatus] = useState("ONLINE");
  const [toast, setToast] = useState("");
  const [liveSpeed, setLiveSpeed] = useState<number>(38.2);
  const [liveEvent, setLiveEvent] = useState<string>("MEN'S 100M FINAL");

  const [fps, setFps] = useState("120 FPS");
  const [startMode, setStartMode] = useState("AI GUN DETECTION");
  const [autoStorage, setAutoStorage] = useState(true);

  const [feedSrc, setFeedSrc] = useState<string>(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/video/feed`);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFeedError = () => {
    setFeedSrc("https://images.unsplash.com/photo-1522850937840-0a256a4b1307?auto=format&fit=crop&q=80&w=1200");
  };

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:8001/ws'}/live-metrics`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLiveSpeed(data.leader_speed_kmh);
      if (data.event) setLiveEvent(data.event);
    };

    return () => ws.close();
  }, []);
  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">LIVE CAPTURE HUD</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">{liveEvent} • Smartphone CV active.</p>
        </div>
        <div className="flex items-center gap-4 bg-track-dark text-white px-4 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#00C8C8] transform -skew-x-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-track-coral rounded-full animate-pulse border-2 border-white"></span>
            <span className="font-black uppercase tracking-widest text-lg">REC</span>
          </div>
          <span className="text-track-lagoon font-black border-l-4 border-track-foam/20 pl-4 text-xl">00:14:23:45</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="brutal-card p-2 bg-track-dark relative">
            <div className="aspect-video bg-black relative overflow-hidden border-4 border-track-dark">
              {/* Live camera / simulation feed */}
              <img 
                src={feedSrc} 
                onError={handleFeedError}
                alt="Track Feed" 
                className="w-full h-full object-cover opacity-90"
              />
              
              {/* CV Simulation Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-32 h-48 border-4 border-track-lagoon shadow-[0_0_15px_rgba(0,200,200,0.5)]">
                  <span className="absolute -top-8 left-0 bg-track-lagoon text-track-dark text-xs font-black px-2 py-1 uppercase transition-all duration-300">
                    Lane 4 : {liveSpeed.toFixed(1)} km/h
                  </span>
                </div>
                <div className="absolute top-24 left-1/3 w-32 h-48 border-4 border-track-coral shadow-[0_0_15px_rgba(255,122,69,0.5)]">
                  <span className="absolute -top-8 left-0 bg-track-coral text-white text-xs font-black px-2 py-1 uppercase transition-all duration-300">
                    Lane 5 : {(liveSpeed - 0.8).toFixed(1)} km/h
                  </span>
                </div>
              </div>

              {/* Camera HUD */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-end bg-gradient-to-t from-track-dark/90 to-transparent">
                <div className="flex gap-4">
                  <div className="bg-white px-3 py-1 font-black text-track-dark text-xs uppercase border-l-4 border-track-lagoon">
                    MAIN CAMERA
                  </div>
                  <div className="bg-white px-3 py-1 font-black text-track-dark text-xs uppercase border-l-4 border-track-foam">
                    {fps}
                  </div>
                  <div className="bg-white px-3 py-1 font-black text-track-dark text-xs uppercase border-l-4 border-track-coral">
                    SMARTPHONE
                  </div>
                </div>
                <button onClick={() => { try { document.documentElement.requestFullscreen(); } catch(e) {} }} className="p-2 bg-white/10 hover:bg-white text-white hover:text-track-dark transition-colors border-2 border-white/20">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 px-2 pb-2 gap-4">
              <div className="flex flex-wrap gap-4">
                {toast && <div className="px-4 py-2 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6 text-sm">{toast}</div>}
                <button onClick={() => setToast("FRAME SAVED TO REPORTS")} className="brutal-button bg-track-coral text-white px-4 py-2 text-sm shadow-[4px_4px_0px_#010F1A]">
                  <Camera className="w-4 h-4 mr-2 stroke-[3]" />
                  Capture Frame
                </button>
                <button onClick={() => setToast("REPLAYING BUFFER")} className="brutal-button bg-white text-track-dark px-4 py-2 text-sm shadow-[4px_4px_0px_#010F1A]">
                  <Play className="w-4 h-4 mr-2 stroke-[3]" />
                  Replay Last 5s
                </button>
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
        </div>

        <div className="space-y-8">
          <div className="brutal-card p-0 flex flex-col">
            <div className="p-4 border-b-8 border-track-dark bg-track-lagoon flex justify-between items-center">
              <h3 className="font-black text-2xl editorial-heading-bebas text-track-dark">CAMERA SETUP</h3>
              <Smartphone className="w-6 h-6 text-track-dark" />
            </div>
            <div className="p-6 space-y-4 bg-white">
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

          <div className="brutal-card p-0 flex flex-col">
            <div className="p-4 border-b-8 border-track-dark bg-track-foam">
              <h3 className="font-black text-2xl editorial-heading-bebas text-track-dark">SYSTEM STATUS</h3>
            </div>
            <div className="p-4 space-y-4 flex-1 bg-white">
              <div className="flex justify-between items-center border-b-4 border-track-dark/10 pb-2">
                <span className="text-sm font-black text-track-dark/60 uppercase">Timing Laser</span>
                <span className="text-sm font-black text-track-lagoon bg-track-dark px-2 py-1 transform -skew-x-6">LOCKED</span>
              </div>
              <div className="flex justify-between items-center border-b-4 border-track-dark/10 pb-2">
                <span className="text-sm font-black text-track-dark/60 uppercase">Wind Gauge</span>
                <span className="text-sm font-black text-track-lagoon bg-track-dark px-2 py-1 transform -skew-x-6">SYNCED</span>
              </div>
              
              <div className="pt-2 mt-auto">
                <h4 className="font-black text-sm text-track-dark uppercase mb-2 border-l-4 border-track-coral pl-3">LANE ASSIGNMENTS</h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map(lane => (
                    <div key={lane} className="flex items-center gap-2 bg-track-foam border-2 border-track-dark p-1.5 hover:-translate-y-1 hover:shadow-[2px_2px_0px_#010F1A] transition-all cursor-pointer">
                      <div className="w-6 h-6 bg-track-dark text-white flex items-center justify-center font-black text-sm transform -skew-x-6">
                        {lane}
                      </div>
                      <div className="flex-1 h-2 bg-track-dark/10 relative">
                        <div className="absolute inset-y-0 left-0 bg-track-coral" style={{ width: `${Math.random() * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
