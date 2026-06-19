import { Pause, Play, SkipBack, SkipForward, Frame, Scissors, Check, Crosshair, ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function VideoAnalysis() {
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(85);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState("FRAME_BY_FRAME");
  const isDemo = sessionStorage.getItem('demoMode') === 'true';

  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  useEffect(() => {
    if (!isDemo) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/video/var-results`)
        .then(res => res.json())
        .then(data => setResults(data))
        .catch(err => console.error(err));
    } else {
      setResults([
        { pos: 1, lane: 4, name: "M. JOHNSON", time: "9.862", diff: "-" },
        { pos: 2, lane: 5, name: "A. DE GRASSE", time: "9.868", diff: "+0.006" },
        { pos: 3, lane: 3, name: "C. COLEMAN", time: "9.891", diff: "+0.029" },
        { pos: 4, lane: 6, name: "F. OMANYALA", time: "9.924", diff: "+0.062" },
        { pos: 5, lane: 2, name: "A. SIMBINE", time: "9.931", diff: "+0.069" },
      ]);
    }
  }, [isDemo]);

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">VAR ANALYSIS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Official photo finish verification.</p>
        </div>
        <div className="flex gap-4">
          {statusMsg && <div className="px-6 py-3 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6">{statusMsg}</div>}
          <button onClick={() => setStatusMsg("CLIP EXPORTED TO REPORTS")} className="brutal-button bg-white text-track-dark px-6 py-3 shadow-[4px_4px_0px_#010F1A]">
            <Scissors className="w-5 h-5 mr-2 stroke-[3]" />
            EXPORT CLIP
          </button>
          <button 
            onClick={() => { setIsLocked(true); setStatusMsg("RESULTS OFFICIALLY VERIFIED AND LOCKED"); }} 
            disabled={isLocked}
            className={`brutal-button ${isLocked ? 'bg-track-lagoon text-track-dark' : 'bg-track-coral text-white'} px-6 py-3 shadow-[4px_4px_0px_#010F1A]`}
          >
            <Check className="w-5 h-5 mr-2 stroke-[3]" />
            {isLocked ? "RESULTS LOCKED" : "VERIFY RESULTS"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          <div className="brutal-card p-4">
            <div className="relative border-4 border-track-dark bg-track-dark overflow-hidden group flex flex-col">
              {/* Tabs */}
              <div className="flex border-b-4 border-track-dark bg-track-foam">
                <button onClick={() => setActiveTab("FRAME_BY_FRAME")} className={`flex-1 px-4 py-3 font-black uppercase tracking-widest transition-colors ${activeTab === "FRAME_BY_FRAME" ? "bg-track-lagoon text-track-dark" : "text-track-dark/60 hover:bg-track-dark/5 hover:text-track-dark"}`}>FRAME VIEWER</button>
                <button onClick={() => setActiveTab("PHOTO_FINISH")} className={`flex-1 px-4 py-3 font-black uppercase tracking-widest transition-colors border-l-4 border-track-dark ${activeTab === "PHOTO_FINISH" ? "bg-track-coral text-white" : "text-track-dark/60 hover:bg-track-dark/5 hover:text-track-dark"}`}>ADVANCED PHOTO FINISH</button>
              </div>

              {/* Main Photo Finish Area */}
              <div className={`h-[400px] w-full relative overflow-hidden transition-all duration-700 ${activeTab === "FRAME_BY_FRAME" ? "grayscale group-hover:grayscale-0" : ""}`}>
                <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }} className="w-full h-full">
                  <img 
                    src={activeTab === "PHOTO_FINISH" ? "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200&h=400" : "https://images.unsplash.com/photo-1552674605-15c2145efa38?auto=format&fit=crop&q=80&w=1200&h=400"} 
                    alt="Photo Finish" 
                    className={`w-full h-full object-cover ${activeTab === "PHOTO_FINISH" ? "scale-x-[2.0]" : ""}`}
                  />
                  
                  {/* AI Overlays */}
                  {showOverlays && activeTab === "FRAME_BY_FRAME" && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Bounding Box Mock */}
                      <div className="absolute top-[20%] left-[45%] w-16 h-32 border-2 border-track-lagoon flex flex-col items-center">
                        <div className="w-2 h-2 bg-track-coral rounded-full mt-8 shadow-[0_0_10px_rgba(255,122,69,1)]"></div>
                        <span className="bg-track-lagoon text-track-dark text-[10px] font-black px-1 mt-auto">ATHLETE</span>
                      </div>
                      {/* Lanes */}
                      <div className="absolute inset-0 border-t-2 border-b-2 border-track-coral/30 top-[30%] h-[15%] flex items-center px-4">
                        <span className="text-white/50 font-black text-2xl">LANE 4</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "PHOTO_FINISH" && (
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent flex items-center justify-center opacity-50 pointer-events-none">
                        <div className="w-[1px] h-full bg-track-coral"></div>
                     </div>
                  )}
                </div>

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  <button onClick={() => setShowOverlays(!showOverlays)} className="bg-white p-2 border-2 border-track-dark hover:bg-track-foam shadow-[2px_2px_0px_#010F1A] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none" title="Toggle AI Overlays">
                    {showOverlays ? <Eye className="w-5 h-5 text-track-dark" /> : <EyeOff className="w-5 h-5 text-track-dark/60" />}
                  </button>
                  <button onClick={() => setZoomLevel(Math.min(zoomLevel + 0.5, 3))} className="bg-white p-2 border-2 border-track-dark hover:bg-track-foam shadow-[2px_2px_0px_#010F1A] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none" title="Zoom In">
                    <ZoomIn className="w-5 h-5 text-track-dark" />
                  </button>
                  <button onClick={() => setZoomLevel(Math.max(zoomLevel - 0.5, 1))} className="bg-white p-2 border-2 border-track-dark hover:bg-track-foam shadow-[2px_2px_0px_#010F1A] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none" title="Zoom Out">
                    <ZoomOut className="w-5 h-5 text-track-dark" />
                  </button>
                </div>
                
                {/* Red Finish Line Overlay */}
                {activeTab === "FRAME_BY_FRAME" && (
                  <div className="absolute top-0 bottom-0 left-[65%] w-1 bg-track-coral shadow-[0_0_15px_rgba(255,122,69,1)] z-10 cursor-ew-resize hover:w-2 transition-all group/line">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-5 h-5 bg-white border-2 border-track-coral rounded-full opacity-0 group-hover/line:opacity-100 flex items-center justify-center">
                      <Crosshair className="w-3 h-3 text-track-coral" />
                    </div>
                  </div>
                )}

                {/* Simulated Time Scale */}
                <div className="absolute bottom-0 inset-x-0 h-8 bg-track-dark/90 flex text-[10px] font-black text-white px-2 pointer-events-none z-10">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end border-l border-white/20 pb-1 pl-1">
                      9.{80 + i}s
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Controls */}
              <div className="bg-white p-4 flex flex-col gap-4 border-t-4 border-track-dark">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setProgress(p => Math.max(0, p - 5))} className="brutal-button bg-track-foam p-3 hover:bg-track-lagoon shadow-[4px_4px_0px_#010F1A]">
                      <SkipBack className="w-5 h-5 stroke-[3]" />
                    </button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className={`brutal-button p-3 ${isPlaying ? 'bg-track-coral text-white' : 'bg-track-foam'} hover:bg-track-coral hover:text-white shadow-[4px_4px_0px_#010F1A]`}>
                      {isPlaying ? <Pause className="w-5 h-5 stroke-[3]" /> : <Play className="w-5 h-5 stroke-[3]" />}
                    </button>
                    <button onClick={() => setProgress(p => Math.min(100, p + 5))} className="brutal-button bg-track-foam p-3 hover:bg-track-lagoon shadow-[4px_4px_0px_#010F1A]">
                      <SkipForward className="w-5 h-5 stroke-[3]" />
                    </button>
                  </div>
                  
                  <div className="flex-1 mx-8 relative flex items-center">
                    <div className="h-4 bg-track-foam border-4 border-track-dark relative w-full">
                      <div className="absolute top-0 left-0 h-full bg-track-coral" style={{ width: `${progress}%` }}></div>
                      <div className="absolute top-1/2 -translate-y-1/2 w-2 h-8 bg-track-dark" style={{ left: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setProgress(p => Math.min(100, p + 1))} className="brutal-button bg-track-foam p-3 hover:bg-track-lagoon shadow-[4px_4px_0px_#010F1A]">
                      <Frame className="w-5 h-5 stroke-[3]" />
                    </button>
                    <div className="font-black text-2xl text-track-dark border-4 border-track-dark px-3 py-1 transform -skew-x-6">
                      9.862<span className="text-track-coral">s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-track-dark/10">
                  <span className="text-sm font-black uppercase tracking-widest text-track-dark/60">PLAYBACK SPEED:</span>
                  {[0.25, 0.5, 1].map(speed => (
                    <button 
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-3 py-1 font-black text-sm uppercase transform -skew-x-6 border-2 border-track-dark hover:bg-track-foam ${playbackSpeed === speed ? 'bg-track-lagoon text-track-dark shadow-[2px_2px_0px_#010F1A]' : 'bg-white text-track-dark/60'}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="brutal-card p-0 h-full flex flex-col">
            <div className="p-4 border-b-8 border-track-dark bg-track-coral">
              <h3 className="font-black text-3xl editorial-heading-bebas text-white">OFFICIAL RANKING</h3>
            </div>
            <div className="p-4 space-y-3 bg-white flex-1 overflow-y-auto">
              {results.length === 0 ? (
                 <div className="text-center font-bold text-track-dark/40 py-8 uppercase">NO VAR DATA AVAILABLE</div>
              ) : results.map((result, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 border-4 border-track-dark ${i === 0 ? 'bg-track-lagoon' : 'bg-track-foam'} hover:-translate-y-1 hover:shadow-[4px_4px_0px_#010F1A] transition-all cursor-pointer`}>
                  <div className={`w-8 h-8 flex items-center justify-center font-black text-lg transform -skew-x-6 ${i === 0 ? 'bg-track-dark text-track-lagoon' : 'bg-track-dark text-white'}`}>
                    {result.pos}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-black text-track-dark uppercase text-sm">{result.name}</span>
                      <span className="font-black text-lg">{result.time}s</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-track-dark/60 font-bold">LANE {result.lane}</span>
                      <span className="text-track-coral font-black">{result.diff}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
