import { Calendar, MapPin, Trophy, Users, ArrowRight, Play, CheckCircle, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Competition {
  id: number;
  name: string;
  date_str: string;
  location: string;
  status: string;
  athletes_count: number;
  events_total: number;
  events_completed: number;
  color: string;
}

export default function Competitions() {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [newMeet, setNewMeet] = useState({
    name: '',
    date_str: '',
    location: '',
    status: 'UPCOMING',
    athletes_count: 0,
    events_total: 0,
    events_completed: 0,
    color: 'bg-track-dark'
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCompetitions = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/competitions/`)
      .then(res => res.json())
      .then(data => {
        setCompetitions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch competitions:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/competitions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        setToast("ERROR: FAILED TO DELETE");
        return;
      }
      
      // Clear active session storage if the deleted meet was the entered one
      const activeMeetId = sessionStorage.getItem('enteredCompetitionId');
      if (activeMeetId && parseInt(activeMeetId) === id) {
        sessionStorage.removeItem('enteredCompetitionId');
        sessionStorage.removeItem('enteredCompetitionName');
        sessionStorage.removeItem('selectedEventId');
      }
      
      fetchCompetitions();
    } catch (err) {
      console.error(err);
    }
  };

  const displayCompetitions = competitions;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/competitions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeet)
      });
      if (!response.ok) {
        setToast("ERROR: FAILED TO CREATE");
        return;
      }
      setIsModalOpen(false);
      setNewMeet({
        name: '', date_str: '', location: '', status: 'UPCOMING', 
        athletes_count: 0, events_total: 0, events_completed: 0, color: 'bg-track-dark'
      });
      fetchCompetitions(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnterMeet = (id: number, name: string) => {
    sessionStorage.setItem('enteredCompetitionId', id.toString());
    sessionStorage.setItem('enteredCompetitionName', name);
    setToast(`ENTERED MEET: ${name}`);
    setTimeout(() => {
      navigate('/dashboard/track-events');
    }, 1000);
  };

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">COMPETITIONS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">
            Event scheduling, results, and meet management.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-track-dark text-white font-black text-lg uppercase px-6 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
        >
          CREATE NEW MEET
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Competitions List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="brutal-card p-12 text-center">
              <h2 className="text-2xl font-black text-track-dark/40 uppercase tracking-widest">LOADING COMPETITIONS...</h2>
            </div>
          ) : displayCompetitions.length === 0 ? (
            <div className="brutal-card p-12 text-center">
              <h2 className="text-2xl font-black text-track-dark/40 uppercase tracking-widest">NO COMPETITIONS FOUND.</h2>
            </div>
          ) : displayCompetitions.map((comp, i) => (
            <div key={i} className="brutal-card p-0 flex flex-col md:flex-row overflow-hidden group hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
              {/* Left Color Bar */}
              <div onClick={() => handleEnterMeet(comp.id, comp.name)} className={`w-full md:w-6 ${comp.color} shrink-0`}></div>
              
              <div onClick={() => handleEnterMeet(comp.id, comp.name)} className="p-6 flex-1 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-2 border-track-dark ${comp.status === 'LIVE' ? 'bg-track-coral text-white animate-pulse' : comp.status === 'COMPLETED' ? 'bg-track-foam text-track-dark/60' : 'bg-track-lagoon text-track-dark'}`}>
                        {comp.status}
                      </span>
                      <span className="text-sm font-bold text-track-dark/60 uppercase flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {comp.date_str}
                      </span>
                    </div>
                    <h2 className="text-3xl editorial-heading-bebas text-track-dark leading-none mb-2 group-hover:text-track-coral transition-colors">
                      {comp.name}
                    </h2>
                    <p className="text-sm font-black text-track-dark/80 uppercase flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-track-lagoon" /> {comp.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t-4 border-track-foam pt-4 mt-4">
                  <div>
                    <p className="text-[10px] font-black text-track-dark/50 uppercase tracking-widest mb-1">ATHLETES</p>
                    <p className="text-xl font-black text-track-dark flex items-center gap-2">
                      <Users className="w-4 h-4 text-track-dark/40" /> {comp.athletes_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-track-dark/50 uppercase tracking-widest mb-1">EVENTS</p>
                    <p className="text-xl font-black text-track-dark flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-track-dark/40" /> {comp.events_total}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-track-dark/50 uppercase tracking-widest mb-1">PROGRESS</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-black text-track-dark">{comp.events_completed}/{comp.events_total}</p>
                      {comp.events_completed === comp.events_total && comp.events_total > 0 && <CheckCircle className="w-5 h-5 text-track-lagoon" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button Area */}
              <div className="w-full md:w-32 bg-track-foam border-t-4 md:border-t-0 md:border-l-4 border-track-dark flex flex-row md:flex-col items-center justify-center gap-3 p-4">
                {confirmDeleteId === comp.id ? (
                  <div className="flex flex-col gap-2 w-full shrink-0">
                    <button 
                      onClick={() => {
                        handleDelete(comp.id);
                        setConfirmDeleteId(null);
                      }}
                      className="w-full py-1 bg-track-coral text-white border-4 border-track-dark font-black text-[10px] uppercase shadow-[2px_2px_0px_#010F1A] hover:shadow-none hover:translate-y-0.5 transition-all text-center cursor-pointer"
                    >
                      CONFIRM
                    </button>
                    <button 
                      onClick={() => setConfirmDeleteId(null)}
                      className="w-full py-1 bg-white text-track-dark border-4 border-track-dark font-black text-[10px] uppercase shadow-[2px_2px_0px_#010F1A] hover:shadow-none hover:translate-y-0.5 transition-all text-center cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setConfirmDeleteId(comp.id)}
                      className="w-12 h-12 bg-white border-4 border-track-dark flex items-center justify-center hover:bg-track-coral hover:text-white transition-colors cursor-pointer"
                      title="Delete Competition"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEnterMeet(comp.id, comp.name)} className="w-12 h-12 bg-white border-4 border-track-dark flex items-center justify-center transform -skew-x-6 hover:bg-track-lagoon transition-colors cursor-pointer">
                      <ArrowRight className="w-6 h-6 stroke-[3]" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="brutal-card p-6 bg-track-lagoon">
            <h3 className="text-2xl editorial-heading-bebas text-track-dark mb-4 border-b-4 border-track-dark pb-2">SEASON SUMMARY</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border-4 border-track-dark p-3 transform -skew-x-2">
                <span className="font-black text-track-dark/60 uppercase tracking-widest text-sm">TOTAL MEETS</span>
                <span className="font-black text-2xl text-track-dark">{competitions.length}</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="brutal-card p-8 bg-track-dark text-white text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-track-coral border-4 border-white flex items-center justify-center transform rotate-12 mb-6">
              <Play className="w-8 h-8 fill-white stroke-none" />
            </div>
            <h3 className="text-3xl editorial-heading-bebas mb-2">RUN SIMULATION</h3>
            <p className="text-sm font-bold text-white/60 mb-6 uppercase">Test camera feeds and timing gates before live events.</p>
            <button onClick={() => navigate('/dashboard/live-capture')} className="w-full bg-white text-track-dark font-black uppercase px-4 py-3 border-4 border-track-coral shadow-[4px_4px_0px_#FF7A45] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
              START TEST
            </button>
          </div>
        </div>
        {toast && <div className="px-6 py-3 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6">{toast}</div>}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-track-dark/80 backdrop-blur-sm">
          <div className="bg-white border-8 border-track-dark shadow-[12px_12px_0px_#00C8C8] w-full max-w-2xl">
            <div className="p-6 border-b-8 border-track-dark bg-track-foam flex justify-between items-center">
              <h2 className="text-4xl editorial-heading-bebas text-track-dark">CREATE COMPETITION</h2>
              <button onClick={() => setIsModalOpen(false)} className="font-black text-track-dark text-xl hover:text-track-coral">X</button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Meet Name</label>
                  <input required value={newMeet.name} onChange={e => setNewMeet({...newMeet, name: e.target.value})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" placeholder="ENTER MEET NAME" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Date String</label>
                  <input required value={newMeet.date_str} onChange={e => setNewMeet({...newMeet, date_str: e.target.value})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" placeholder="ENTER DATES (E.G. OCT 10 - OCT 12, 2026)" />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Location</label>
                  <input required value={newMeet.location} onChange={e => setNewMeet({...newMeet, location: e.target.value})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" placeholder="ENTER LOCATION" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Total Events</label>
                  <input type="number" required value={newMeet.events_total} onChange={e => setNewMeet({...newMeet, events_total: parseInt(e.target.value) || 0})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Theme Color</label>
                  <select value={newMeet.color} onChange={e => setNewMeet({...newMeet, color: e.target.value})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase appearance-none">
                    <option value="bg-track-dark">DARK</option>
                    <option value="bg-track-coral">CORAL (ORANGE)</option>
                    <option value="bg-track-lagoon">LAGOON (TEAL)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-6 border-t-4 border-track-dark">
                <button type="submit" className="bg-track-coral text-white font-black text-lg uppercase px-8 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                  INITIALIZE MEET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
