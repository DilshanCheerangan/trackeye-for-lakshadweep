import { Map, Users, Trophy, Shield, Medal } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Islands() {
  const [islands, setIslands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/islands/`)
      .then(res => res.json())
      .then(data => {
        setIslands(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  // Removed hardcoded data

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">ISLAND TEAMS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Lakshadweep Sports Meet Administration</p>
        </div>
        <div className="flex items-center gap-4 bg-white border-4 border-track-dark p-2 shadow-[4px_4px_0px_#010F1A]">
           <div className="flex items-center gap-2 px-3">
             <span className="w-3 h-3 bg-track-coral rounded-full animate-pulse"></span>
             <span className="font-black uppercase tracking-widest text-sm text-track-coral">LIVE STANDINGS</span>
           </div>
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
                  {islands.map((island, i) => (
                    <tr key={i} className={`border-b-4 border-track-dark/10 hover:bg-track-foam transition-colors ${i < 3 ? 'bg-track-foam/30' : 'bg-white'}`}>
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
            <span className="bg-track-dark text-white px-2 py-1 font-black uppercase text-xs">10 ISLANDS</span>
          </div>

          <div className="grid grid-cols-1 gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {islands.map((island, i) => (
              <div key={i} className="brutal-card p-0 overflow-hidden bg-white flex group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className={`w-4 shrink-0 ${island.color || 'bg-track-dark/20'} border-r-4 border-track-dark`}></div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-3 border-b-2 border-track-dark pb-2">
                    <h4 className="font-black text-xl text-track-dark uppercase flex items-center gap-2">
                      <Map className="w-5 h-5 text-track-dark/60" /> {island.name}
                    </h4>
                    <span className="bg-track-foam px-2 py-1 border-2 border-track-dark font-black text-xs uppercase flex items-center gap-1">
                      <Users className="w-3 h-3" /> {island.athletes}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
