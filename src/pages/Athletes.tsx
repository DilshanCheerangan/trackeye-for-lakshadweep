import { Search, Filter, MapPin, Award, Trash2, X, TrendingUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Athlete {
  id: number;
  athlete_id: string;
  name: string;
  event: string;
  island: string;
  pb: string;
  status: string;
}

export default function Athletes() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchAthletes = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/athletes/`)
      .then(res => res.json())
      .then(data => {
        setAthletes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch athletes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/athletes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchAthletes();
      } else {
        setToast("ERROR: FAILED TO DELETE");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayAthletes = athletes;

  const filteredAthletes = displayAthletes.filter(athlete => {
    const q = searchQuery.toLowerCase();
    return (
      athlete.name.toLowerCase().includes(q) ||
      athlete.athlete_id.toLowerCase().includes(q) ||
      athlete.event.toLowerCase().includes(q) ||
      athlete.island.toLowerCase().includes(q)
    );
  });
  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">ATHLETE ROSTER</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">
            Manage competitors, performance records, and statuses.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-white border-4 border-track-dark p-2 shadow-[4px_4px_0px_#010F1A]">
          <Search className="w-6 h-6 text-track-dark/40 ml-2" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME, ID, OR EVENT..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none px-4 font-black text-track-dark uppercase tracking-wider placeholder:text-track-dark/30"
          />
        </div>
        
        {toast && <div className="px-6 py-3 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6">{toast}</div>}

        <button onClick={() => setToast("FILTERS APPLIED")} className="bg-track-dark text-white font-black uppercase px-6 py-3 border-4 border-track-dark flex items-center gap-2 hover:bg-track-foam hover:text-track-dark transition-colors">
          <Filter className="w-5 h-5 stroke-[3]" />
          FILTERS
        </button>
      </div>

      {/* Data Table */}
      <div className="brutal-card p-0 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-track-foam border-b-4 border-track-dark">
                <th className="p-4 font-black text-track-dark uppercase tracking-widest text-sm border-r-4 border-track-dark w-24">ID</th>
                <th className="p-4 font-black text-track-dark uppercase tracking-widest text-sm border-r-4 border-track-dark">ATHLETE NAME</th>
                <th className="p-4 font-black text-track-dark uppercase tracking-widest text-sm border-r-4 border-track-dark">PRIMARY EVENT</th>
                <th className="p-4 font-black text-track-dark uppercase tracking-widest text-sm border-r-4 border-track-dark">ISLAND</th>
                <th className="p-4 font-black text-track-dark uppercase tracking-widest text-sm border-r-4 border-track-dark w-32">PERSONAL BEST</th>
                <th className="p-4 font-black text-track-dark uppercase tracking-widest text-sm border-r-4 border-track-dark w-32">STATUS</th>
                <th className="p-4 font-black text-track-dark uppercase tracking-widest text-sm w-16 text-center">ACT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center font-black text-track-dark/40 uppercase tracking-widest">
                    LOADING ATHLETES...
                  </td>
                </tr>
              ) : filteredAthletes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center font-black text-track-dark/40 uppercase tracking-widest">
                    NO ATHLETES FOUND.
                  </td>
                </tr>
              ) : filteredAthletes.map((athlete, i) => (
                <tr key={i} onClick={() => setSelectedAthlete(athlete)} className="border-b-4 border-track-dark hover:bg-track-foam/50 transition-colors group cursor-pointer">
                  <td className="p-4 border-r-4 border-track-dark font-bold text-track-dark/60">{athlete.athlete_id}</td>
                  <td className="p-4 border-r-4 border-track-dark font-black text-lg text-track-dark">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-track-dark text-white flex items-center justify-center font-bebas text-xl pt-1 transform -skew-x-6">
                        {athlete.name.charAt(0)}
                      </div>
                      {athlete.name}
                    </div>
                  </td>
                  <td className="p-4 border-r-4 border-track-dark">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-track-coral/10 text-track-coral font-black text-xs uppercase tracking-widest border-2 border-track-coral/20">
                      <Award className="w-3 h-3" />
                      {athlete.event}
                    </span>
                  </td>
                  <td className="p-4 border-r-4 border-track-dark">
                    <div className="flex items-center gap-1.5 font-bold text-track-dark/80 text-sm uppercase">
                      <MapPin className="w-4 h-4 text-track-lagoon" />
                      {athlete.island}
                    </div>
                  </td>
                  <td className="p-4 border-r-4 border-track-dark font-black text-xl text-track-dark editorial-heading-bebas">
                    {athlete.pb}
                  </td>
                  <td className="p-4 border-r-4 border-track-dark">
                    <span className={`px-2 py-1 font-black text-xs uppercase tracking-widest border-2 ${
                      athlete.status === 'ACTIVE' 
                        ? 'bg-track-lagoon/20 text-track-dark border-track-lagoon' 
                        : 'bg-track-dark/10 text-track-dark/60 border-track-dark/20'
                    }`}>
                      {athlete.status}
                    </span>
                  </td>
                   <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    {confirmDeleteId === athlete.id ? (
                      <div className="flex gap-1 justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(athlete.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 bg-track-coral text-white border-2 border-track-dark font-black text-[9px] uppercase shadow-[1px_1px_0px_#010F1A] cursor-pointer"
                        >
                          YES
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 bg-white text-track-dark border-2 border-track-dark font-black text-[9px] uppercase shadow-[1px_1px_0px_#010F1A] cursor-pointer"
                        >
                          NO
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(athlete.id); }} 
                        className="p-2 text-track-dark/40 hover:text-track-coral transition-colors hover:bg-track-foam border border-transparent hover:border-track-dark rounded cursor-pointer"
                        title="Delete Athlete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {/* Athlete Profile Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-track-dark/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-8 border-track-dark shadow-[12px_12px_0px_#00C8C8] w-full max-w-5xl my-8">
            <div className="p-6 border-b-8 border-track-dark bg-track-foam flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-track-dark text-white flex items-center justify-center font-bebas text-4xl pt-2 transform -skew-x-6">
                  {selectedAthlete.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-4xl editorial-heading-bebas text-track-dark">{selectedAthlete.name}</h2>
                  <div className="flex gap-4 text-sm font-black uppercase tracking-widest text-track-dark/60 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedAthlete.island}</span>
                    <span className="flex items-center gap-1 text-track-lagoon"><Award className="w-4 h-4" /> {selectedAthlete.event}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAthlete(null)} className="font-black text-track-dark hover:text-track-coral p-2"><X className="w-8 h-8" /></button>
            </div>
            
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white">
              {/* Left Column: Stats & PRs */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-black text-xl editorial-heading-bebas text-track-dark border-b-4 border-track-dark pb-2 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-track-coral" /> PERSONAL RECORDS
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-track-foam border-4 border-track-dark p-3 flex justify-between items-center">
                      <span className="font-black uppercase text-sm">100M SPRINT</span>
                      <span className="font-black text-xl text-track-coral">{selectedAthlete.pb}</span>
                    </div>
                    <div className="bg-track-foam border-4 border-track-dark p-3 flex justify-between items-center opacity-70">
                      <span className="font-black uppercase text-sm">200M SPRINT</span>
                      <span className="font-black text-xl text-track-dark">20.12s</span>
                    </div>
                    <div className="bg-track-foam border-4 border-track-dark p-3 flex justify-between items-center opacity-70">
                      <span className="font-black uppercase text-sm">LONG JUMP</span>
                      <span className="font-black text-xl text-track-dark">7.84m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Analytics & History */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="font-black text-xl editorial-heading-bebas text-track-dark border-b-4 border-track-dark pb-2 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-track-lagoon" /> PERFORMANCE ANALYTICS
                  </h3>
                  <div className="bg-track-dark p-6 border-4 border-track-dark relative h-64 flex items-end gap-2">
                    {/* Mock Chart */}
                    <div className="absolute top-4 left-4 text-white/50 font-black text-xs uppercase">100M Time Progression (Season)</div>
                    {[10.2, 10.15, 10.05, 9.98, 9.92, 9.89, 9.86].map((time, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group">
                        <span className="text-track-lagoon font-black text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{time}s</span>
                        <div 
                          className="w-full bg-track-coral border-2 border-track-dark transition-all duration-500 group-hover:bg-track-lagoon"
                          style={{ height: `${(11 - time) * 40}%` }}
                        ></div>
                        <span className="text-white/40 font-bold text-[10px] mt-2">M{idx+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-xl editorial-heading-bebas text-track-dark border-b-4 border-track-dark pb-2 mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-track-dark/60" /> COMPETITION HISTORY
                  </h3>
                  <div className="space-y-4">
                    {[
                      { meet: "NATIONAL CHAMPIONSHIPS 2025", date: "AUG 2025", result: "GOLD", mark: "9.86s" },
                      { meet: "STATE ATHLETICS MEET", date: "JUN 2025", result: "GOLD", mark: "9.92s" },
                      { meet: "UNIVERSITY GAMES", date: "APR 2025", result: "SILVER", mark: "10.05s" }
                    ].map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border-2 border-track-dark/20 hover:border-track-dark hover:bg-track-foam transition-colors cursor-default">
                        <div>
                          <h4 className="font-black text-track-dark uppercase">{comp.meet}</h4>
                          <span className="text-xs font-bold text-track-dark/60 uppercase">{comp.date}</span>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                          <span className="font-black text-lg text-track-dark">{comp.mark}</span>
                          <span className={`w-20 text-center px-2 py-1 font-black text-xs uppercase border-2 ${comp.result === 'GOLD' ? 'bg-[#FFD700] border-track-dark text-track-dark' : 'bg-[#C0C0C0] border-track-dark text-track-dark'}`}>
                            {comp.result}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
