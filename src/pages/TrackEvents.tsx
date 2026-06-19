import { Medal, Timer, Wind, Trophy, CheckSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TrackEvents() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState<'PENDING' | 'APPROVED'>('PENDING');

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/events/1/results`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((d: any) => ({
           pos: d.position, lane: d.lane_or_order, name: d.athlete_name, island: d.island,
           reaction: d.reaction, time: d.mark, pb: d.is_pb, newRecord: d.new_record
        }));
        setResults(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Removed hardcoded data
  const displayResults = results;

  const handleApprove = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/events/1/approve`, { method: 'PUT' })
      .then(res => res.json())
      .then(() => setApprovalStatus('APPROVED'))
      .catch(err => console.error(err));
  };

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">TRACK EVENTS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Men's 100m Final • Heat 1 • Official Results</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {approvalStatus === 'PENDING' ? (
            <button onClick={handleApprove} className="flex items-center gap-2 bg-[#FFD700] text-track-dark px-4 py-2 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] font-black uppercase tracking-widest hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all transform -skew-x-6">
              <CheckSquare className="w-5 h-5 stroke-[3]" /> APPROVE RESULTS
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#21A366] text-white border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] transform -skew-x-6 font-black uppercase tracking-widest">
              <CheckSquare className="w-5 h-5 stroke-[3]" /> RESULTS APPROVED
            </div>
          )}
          <div className="flex items-center gap-4 bg-white border-4 border-track-dark p-2 shadow-[4px_4px_0px_#010F1A]">
            <div className="flex items-center gap-2 px-3 border-r-4 border-track-dark">
              <Wind className="w-5 h-5 text-track-dark stroke-[3]" />
              <span className="font-black text-lg">+1.2 m/s</span>
            </div>
            <div className="flex items-center gap-2 px-3">
              <span className={`w-3 h-3 rounded-full ${approvalStatus === 'PENDING' ? 'bg-[#FFD700] animate-pulse' : 'bg-[#21A366]'}`}></span>
              <span className={`font-black uppercase tracking-widest text-sm ${approvalStatus === 'PENDING' ? 'text-track-dark' : 'text-[#21A366]'}`}>
                {approvalStatus === 'PENDING' ? 'UNDER REVIEW' : 'OFFICIAL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { level: "WORLD RECORD", name: "USAIN BOLT", time: "9.58s", year: "2009" },
          { level: "NATIONAL RECORD", name: "MARCUS JOHNSON", time: "9.86s", year: "2025" },
          { level: "MEET RECORD", name: "CHRISTIAN COLEMAN", time: "9.92s", year: "2023" },
          { level: "STADIUM RECORD", name: "ANDRE DE GRASSE", time: "9.89s", year: "2024" }
        ].map((rec, i) => (
          <div key={i} className="brutal-card p-4 bg-white border-4 border-track-dark shadow-[4px_4px_0px_#010F1A]">
            <h4 className="text-xs font-black text-track-dark/60 uppercase tracking-widest border-b-2 border-track-dark pb-2 mb-2">{rec.level}</h4>
            <div className="flex justify-between items-end">
               <div>
                 <p className="font-black text-track-dark uppercase text-sm">{rec.name}</p>
                 <p className="text-xs font-bold text-track-dark/40">{rec.year}</p>
               </div>
               <span className="font-black text-xl text-track-coral">{rec.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-3 brutal-card p-0 flex flex-col justify-end bg-track-foam min-h-[300px]">
          <div className="flex justify-center items-end gap-2 p-8 border-b-8 border-track-dark">
            {/* Silver */}
            {displayResults[1] && (
              <div className="flex flex-col items-center w-32 group cursor-pointer">
                <div className="w-12 h-12 bg-[#E2E8F0] border-4 border-track-dark rounded-full flex items-center justify-center mb-4 z-10 shadow-[4px_4px_0px_#010F1A] transform group-hover:-translate-y-2 transition-transform">
                  <Medal className="w-6 h-6 text-track-dark stroke-[2.5]" />
                </div>
                <div className="h-32 w-full bg-[#E2E8F0] border-4 border-track-dark border-b-0 flex flex-col items-center justify-end pb-4">
                  <span className="text-4xl font-black text-track-dark">2</span>
                </div>
                <div className="text-center mt-4">
                  <p className="font-black text-track-dark text-sm uppercase">{displayResults[1].name.split(' ')[0]}</p>
                  <p className="text-sm font-bold text-track-dark/60">{displayResults[1].time}</p>
                </div>
              </div>
            )}

            {/* Gold */}
            {displayResults[0] && (
              <div className="flex flex-col items-center w-40 group cursor-pointer relative -top-8">
                <div className="w-16 h-16 bg-track-sand border-4 border-track-dark rounded-full flex items-center justify-center mb-4 z-10 shadow-[4px_4px_0px_#010F1A] transform group-hover:-translate-y-2 transition-transform">
                  <Medal className="w-8 h-8 text-track-dark stroke-[2.5]" />
                </div>
                <div className="h-40 w-full bg-track-sand border-4 border-track-dark border-b-0 flex flex-col items-center justify-end pb-4">
                  <span className="text-6xl font-black text-track-dark">1</span>
                </div>
                <div className="text-center mt-4">
                  <p className="font-black text-track-dark text-base uppercase">{displayResults[0].name.split(' ')[0]}</p>
                  <p className="text-sm font-black text-track-coral">{displayResults[0].time} {displayResults[0].pb && 'PB'}</p>
                </div>
              </div>
            )}

            {/* Bronze */}
            {displayResults[2] && (
              <div className="flex flex-col items-center w-32 group cursor-pointer relative top-4">
                <div className="w-12 h-12 bg-[#CD7F32] border-4 border-track-dark rounded-full flex items-center justify-center mb-4 z-10 shadow-[4px_4px_0px_#010F1A] transform group-hover:-translate-y-2 transition-transform">
                  <Medal className="w-6 h-6 text-white stroke-[2.5]" />
                </div>
                <div className="h-24 w-full bg-[#CD7F32] border-4 border-track-dark border-b-0 flex flex-col items-center justify-end pb-4">
                  <span className="text-4xl font-black text-white">3</span>
                </div>
                <div className="text-center mt-4">
                  <p className="font-black text-track-dark text-sm uppercase">{displayResults[2].name.split(' ')[0]}</p>
                  <p className="text-sm font-bold text-track-dark/60">{displayResults[2].time}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="brutal-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-track-dark text-white text-sm uppercase tracking-widest font-black border-b-8 border-track-dark">
                <th className="p-4 border-r-4 border-track-dark/20 text-center w-16">POS</th>
                <th className="p-4 border-r-4 border-track-dark/20 text-center w-16">LANE</th>
                <th className="p-4 border-r-4 border-track-dark/20">ATHLETE</th>
                <th className="p-4 border-r-4 border-track-dark/20 text-center">ISLAND</th>
                <th className="p-4 border-r-4 border-track-dark/20 text-right">REACTION</th>
                <th className="p-4 border-r-4 border-track-dark/20 text-right">GAP (NR)</th>
                <th className="p-4 text-right">TIME</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center font-bold text-track-dark/40 uppercase">Loading Results...</td>
                </tr>
              ) : displayResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center font-bold text-track-dark/40 uppercase">No Athletes Registered</td>
                </tr>
              ) : displayResults.map((result, i) => (
                <tr key={i} className={`border-b-4 border-track-dark/10 hover:bg-track-foam transition-colors ${i < 3 ? 'bg-white' : 'bg-track-foam/50'}`}>
                  <td className="p-4 border-r-4 border-track-dark/10 text-center font-black text-2xl text-track-dark">{result.pos}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-center">
                    <div className="w-8 h-8 mx-auto bg-track-dark text-white flex items-center justify-center font-black transform -skew-x-6">
                      {result.lane}
                    </div>
                  </td>
                  <td className="p-4 border-r-4 border-track-dark/10 font-black text-track-dark text-lg uppercase">{result.name}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-center font-black text-track-dark/60 uppercase">{result.island}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-right font-bold text-track-dark/80">
                    <div className="flex items-center justify-end gap-2">
                      <Timer className="w-4 h-4" /> {result.reaction}
                    </div>
                  </td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-right font-black text-track-dark/40">
                    {result.pos === 1 ? "-" : `+${(parseFloat(result.time) - 9.86).toFixed(2)}s`}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end justify-center gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-2xl text-track-dark">{result.time}</span>
                        {result.pb && !result.newRecord && (
                          <span className="bg-track-coral text-white text-xs font-black px-2 py-1 transform -skew-x-6 shadow-[2px_2px_0px_#010F1A]">PB</span>
                        )}
                      </div>
                      {result.newRecord && (
                        <span className="bg-[#FFD700] text-track-dark text-[10px] font-black px-2 py-0.5 transform -skew-x-6 shadow-[2px_2px_0px_#010F1A] border-2 border-track-dark animate-pulse whitespace-nowrap flex items-center gap-1">
                          <Trophy className="w-3 h-3"/> {result.newRecord}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
