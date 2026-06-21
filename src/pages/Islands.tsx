import { Map, Users, Trophy, Shield, Medal, Plus, Trash2, Edit3, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Island {
  id: number;
  name: string;
  manager: string;
  coach: string;
  gold: number;
  silver: number;
  bronze: number;
  color: string;
  athletes?: number;
}

export default function Islands() {
  const [islands, setIslands] = useState<Island[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [toast, setToast] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [newIsland, setNewIsland] = useState({
    name: '',
    manager: '',
    coach: '',
    gold: 0,
    silver: 0,
    bronze: 0,
    color: 'bg-track-dark'
  });

  const fetchIslands = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/islands/`)
      .then(res => res.json())
      .then(data => {
        setIslands(data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchIslands();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = selectedIsland
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/islands/${selectedIsland.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/islands/`;
      
      const method = selectedIsland ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIsland)
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setSelectedIsland(null);
        setNewIsland({ name: '', manager: '', coach: '', gold: 0, silver: 0, bronze: 0, color: 'bg-track-dark' });
        fetchIslands();
        setToast(selectedIsland ? "ISLAND TEAM UPDATED" : "ISLAND TEAM REGISTERED");
      } else {
        setToast("ERROR: OPERATION FAILED");
      }
    } catch (err) {
      console.error(err);
      setToast("ERROR: UNABLE TO CONNECT TO SERVER");
    }
  };

  const startAdd = () => {
    setSelectedIsland(null);
    setNewIsland({ name: '', manager: '', coach: '', gold: 0, silver: 0, bronze: 0, color: 'bg-track-dark' });
    setIsModalOpen(true);
  };

  const startEdit = (island: Island) => {
    setSelectedIsland(island);
    setNewIsland({
      name: island.name,
      manager: island.manager,
      coach: island.coach,
      gold: island.gold,
      silver: island.silver,
      bronze: island.bronze,
      color: island.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/islands/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchIslands();
        setToast("ISLAND TEAM DELETED");
      } else {
        setToast("ERROR: FAILED TO DELETE");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const LAK_ISLANDS = [
    "AGATTI",
    "AMINI",
    "ANDROTH",
    "BITRA",
    "CHETLAT",
    "KADMAT",
    "KALPENI",
    "KAVARATTI",
    "KILTAN",
    "MINICOY"
  ];

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">ISLAND TEAMS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Lakshadweep Sports Meet Administration</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
          {toast && <div className="px-6 py-3 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6">{toast}</div>}
          <button 
            onClick={startAdd}
            className="bg-track-coral text-white font-black text-lg uppercase px-6 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            REGISTER TEAM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Medal Table */}
        <div className="lg:col-span-2">
          <div className="brutal-card p-0 overflow-hidden bg-white relative">
            <div className="p-4 border-b-8 border-track-dark bg-track-foam flex justify-between items-center z-10 relative">
              <h3 className="font-black text-3xl editorial-heading-bebas text-track-dark flex items-center gap-3">
                <Trophy className="w-8 h-8 text-track-coral" /> MEDAL STANDINGS
              </h3>
            </div>
            
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-track-dark text-white text-sm uppercase tracking-widest font-black border-b-4 border-track-dark">
                    <th className="p-4 border-r-4 border-track-dark/20 w-16">RK</th>
                    <th className="p-4 border-r-4 border-track-dark/20 text-left">ISLAND</th>
                    <th className="p-4 border-r-4 border-track-dark/20 w-24 bg-[#FFD700]/20 text-[#FFD700]">GOLD</th>
                    <th className="p-4 border-r-4 border-track-dark/20 w-24 bg-[#C0C0C0]/20 text-[#C0C0C0]">SILVER</th>
                    <th className="p-4 border-r-4 border-track-dark/20 w-24 bg-[#CD7F32]/20 text-[#CD7F32]">BRONZE</th>
                    <th className="p-4 w-24 text-track-lagoon">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {islands.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center font-black text-track-dark/40 uppercase tracking-widest">
                        NO TEAMS REGISTERED.
                      </td>
                    </tr>
                  ) : islands.map((island, i) => (
                    <tr key={island.id} className={`border-b-4 border-track-dark/10 hover:bg-track-foam transition-colors ${i < 3 ? 'bg-track-foam/30' : 'bg-white'}`}>
                      <td className="p-4 border-r-4 border-track-dark/10 font-black text-xl text-track-dark">{i + 1}</td>
                      <td className="p-4 border-r-4 border-track-dark/10 text-left font-black text-track-dark text-lg uppercase flex items-center gap-2">
                        {i === 0 && <Medal className="w-5 h-5 text-[#FFD700]" />}
                        {island.name}
                      </td>
                      <td className="p-4 border-r-4 border-track-dark/10 font-black text-2xl">{island.gold}</td>
                      <td className="p-4 border-r-4 border-track-dark/10 font-black text-2xl">{island.silver}</td>
                      <td className="p-4 border-r-4 border-track-dark/10 font-black text-2xl">{island.bronze}</td>
                      <td className="p-4 font-black text-2xl text-track-dark bg-track-dark/5">
                        {island.gold + island.silver + island.bronze}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Registered Islands Grid */}
        <div className="space-y-6">
          <div className="p-4 border-b-8 border-track-dark bg-track-coral flex justify-between items-center transform -skew-x-2 shadow-[4px_4px_0px_#010F1A] mb-4">
            <h3 className="font-black text-2xl editorial-heading-bebas text-white">ISLAND ROSTERS</h3>
            <span className="bg-track-dark text-white px-2 py-1 font-black uppercase text-xs">{islands.length} TEAMS</span>
          </div>

          <div className="grid grid-cols-1 gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {islands.map((island) => (
              <div key={island.id} className="brutal-card p-0 overflow-hidden bg-white flex group relative">
                <div className={`w-4 shrink-0 ${island.color || 'bg-track-dark/20'} border-r-4 border-track-dark`}></div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-3 border-b-2 border-track-dark pb-2">
                    <h4 className="font-black text-xl text-track-dark uppercase flex items-center gap-2">
                      <Map className="w-5 h-5 text-track-dark/60" /> {island.name}
                    </h4>
                    <span className="bg-track-foam px-2 py-1 border-2 border-track-dark font-black text-xs uppercase flex items-center gap-1">
                      <Users className="w-3 h-3" /> {island.athletes ?? 0}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-track-coral" />
                      <span className="text-[10px] font-black text-track-dark/50 uppercase w-16 tracking-widest">MANAGER</span>
                      <span className="text-sm font-bold text-track-dark uppercase">{island.manager}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-track-lagoon" />
                      <span className="text-[10px] font-black text-track-dark/50 uppercase w-16 tracking-widest">COACH</span>
                      <span className="text-sm font-bold text-track-dark uppercase">{island.coach}</span>
                    </div>
                  </div>

                  {/* Actions area inside card */}
                  <div className="flex justify-end gap-2 border-t border-track-dark/10 pt-3 mt-3">
                    <button 
                      onClick={() => startEdit(island)}
                      className="p-1.5 text-track-dark/60 hover:text-track-lagoon transition-colors hover:bg-track-foam border border-transparent hover:border-track-dark"
                      title="Edit Team Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {confirmDeleteId === island.id ? (
                      <div className="flex gap-1 items-center">
                        <button 
                          onClick={() => {
                            handleDelete(island.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 bg-track-coral text-white border-2 border-track-dark font-black text-[9px] uppercase cursor-pointer"
                        >
                          YES
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 bg-white text-track-dark border-2 border-track-dark font-black text-[9px] uppercase cursor-pointer"
                        >
                          NO
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteId(island.id)}
                        className="p-1.5 text-track-dark/60 hover:text-track-coral transition-colors hover:bg-track-foam border border-transparent hover:border-track-dark cursor-pointer"
                        title="Delete Team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Register/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-track-dark/80 backdrop-blur-sm">
          <div className="bg-white border-8 border-track-dark shadow-[12px_12px_0px_#FF7A45] w-full max-w-2xl">
            <div className="p-6 border-b-8 border-track-dark bg-track-foam flex justify-between items-center">
              <h2 className="text-4xl editorial-heading-bebas text-track-dark">
                {selectedIsland ? 'EDIT ISLAND TEAM' : 'REGISTER ISLAND TEAM'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="font-black text-track-dark text-xl hover:text-track-coral">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Island / Team Name</label>
                  {selectedIsland ? (
                    <input disabled value={newIsland.name} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase opacity-60 cursor-not-allowed" />
                  ) : (
                    <select required value={newIsland.name} onChange={e => setNewIsland({...newIsland, name: e.target.value})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase cursor-pointer appearance-none">
                      <option value="">SELECT ISLAND...</option>
                      {LAK_ISLANDS.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Team Manager</label>
                  <input required value={newIsland.manager} onChange={e => setNewIsland({...newIsland, manager: e.target.value.toUpperCase()})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" placeholder="ENTER TEAM MANAGER NAME" />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Head Coach</label>
                  <input required value={newIsland.coach} onChange={e => setNewIsland({...newIsland, coach: e.target.value.toUpperCase()})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" placeholder="ENTER HEAD COACH NAME" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-2">Gold Medals</label>
                  <input type="number" min="0" required value={newIsland.gold} onChange={e => setNewIsland({...newIsland, gold: parseInt(e.target.value) || 0})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-2">Silver Medals</label>
                  <input type="number" min="0" required value={newIsland.silver} onChange={e => setNewIsland({...newIsland, silver: parseInt(e.target.value) || 0})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-2">Bronze Medals</label>
                  <input type="number" min="0" required value={newIsland.bronze} onChange={e => setNewIsland({...newIsland, bronze: parseInt(e.target.value) || 0})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-black uppercase tracking-widest text-track-dark mb-2">Theme Color</label>
                  <select value={newIsland.color} onChange={e => setNewIsland({...newIsland, color: e.target.value})} className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase appearance-none cursor-pointer">
                    <option value="bg-track-dark">DARK</option>
                    <option value="bg-track-coral">CORAL (ORANGE)</option>
                    <option value="bg-track-lagoon">LAGOON (TEAL)</option>
                    <option value="bg-track-foam">FOAM (LIGHT)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-6 border-t-4 border-track-dark">
                <button type="submit" className="bg-track-lagoon text-track-dark font-black text-lg uppercase px-8 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                  {selectedIsland ? 'SAVE CHANGES' : 'REGISTER TEAM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
