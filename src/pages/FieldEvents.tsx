import { Target, AlertCircle, CheckSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FieldEvents() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState<'PENDING' | 'APPROVED'>('PENDING');

  const [displayAttempts, setDisplayAttempts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/events/2/results`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((d: any) => ({
           pos: d.position, name: d.athlete_name, island: d.island,
           best: d.mark, pb: d.is_pb, a1: d.mark, a2: "X", a3: "-", a4: "-", a5: "-", a6: "-"
        }));
        setDisplayAttempts(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Removed hardcoded data

  const handleApprove = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/events/2/approve`, { method: 'PUT' })
      .then(res => res.json())
      .then(() => setApprovalStatus('APPROVED'))
      .catch(err => console.error(err));
  };

  // Format Helper
  const formatAttempt = (val: string) => {
    if (val === 'X') return <span className="text-track-coral font-black">X</span>;
    return <span className="font-bold">{val}</span>;
  };

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">FIELD EVENTS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Women's Long Jump • Final • Live</p>
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
              <Target className="w-5 h-5 text-track-dark stroke-[3]" />
              <span className="font-black text-lg">ROUND 6</span>
            </div>
            <div className="flex items-center gap-2 px-3">
              <span className={`w-3 h-3 rounded-full animate-pulse ${approvalStatus === 'PENDING' ? 'bg-track-coral' : 'bg-[#21A366]'}`}></span>
              <span className={`font-black uppercase tracking-widest text-sm ${approvalStatus === 'PENDING' ? 'text-track-coral' : 'text-[#21A366]'}`}>
                {approvalStatus === 'PENDING' ? 'LIVE' : 'OFFICIAL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <div className="lg:col-span-1 brutal-card p-6 bg-track-dark text-white flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-track-coral border-4 border-white flex items-center justify-center transform -skew-x-12 mb-6 shadow-[4px_4px_0px_#00C8C8]">
            <Target className="w-10 h-10 text-white stroke-[3]" />
          </div>
          <h3 className="text-sm font-black text-white/50 uppercase tracking-widest mb-2">CURRENT LEADER</h3>
          <p className="text-4xl editorial-heading-bebas mb-2 uppercase">{displayAttempts[0]?.name?.split(' ')[0]}</p>
          <div className="text-5xl font-black text-track-lagoon">{displayAttempts[0]?.best}</div>
        </div>

        <div className="lg:col-span-3 brutal-card p-6 bg-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 text-track-dark pointer-events-none">
            <AlertCircle className="w-64 h-64" />
          </div>
          <div className="flex justify-between items-center mb-6 border-b-4 border-track-dark pb-4 relative z-10">
             <h3 className="text-3xl editorial-heading-bebas text-track-dark">LATEST ATTEMPT</h3>
             <span className="bg-track-coral text-white font-black px-3 py-1 text-sm uppercase transform -skew-x-12 shadow-[2px_2px_0px_#010F1A]">UNDER REVIEW</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
             <div className="w-32 h-32 bg-track-foam border-4 border-track-dark rounded-full overflow-hidden shrink-0 flex items-center justify-center">
               <div className="w-full h-full bg-track-dark text-white flex items-center justify-center font-editorial-bebas text-6xl">
                 {displayAttempts[0]?.name?.charAt(0)}
               </div>
             </div>
             <div className="flex-1 text-center md:text-left">
                <p className="text-xl font-black text-track-dark uppercase mb-1">{displayAttempts[0]?.name}</p>
                <p className="text-sm font-bold text-track-dark/60 uppercase mb-4">Attempt 6</p>
                <div className="flex justify-center md:justify-start items-end gap-4">
                   <div className="text-6xl font-black text-track-dark leading-none">{displayAttempts[0]?.best}</div>
                   <div className="text-lg font-bold text-track-dark/50 mb-1">Wind: +0.8</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="brutal-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-track-dark text-white text-sm uppercase tracking-widest font-black border-b-8 border-track-dark">
                <th className="p-4 border-r-4 border-track-dark/20 w-16">POS</th>
                <th className="p-4 border-r-4 border-track-dark/20 text-left">ATHLETE</th>
                <th className="p-4 border-r-4 border-track-dark/20">1</th>
                <th className="p-4 border-r-4 border-track-dark/20">2</th>
                <th className="p-4 border-r-4 border-track-dark/20">3</th>
                <th className="p-4 border-r-4 border-track-dark/20">4</th>
                <th className="p-4 border-r-4 border-track-dark/20">5</th>
                <th className="p-4 border-r-4 border-track-dark/20">6</th>
                <th className="p-4 text-right bg-track-lagoon text-track-dark">BEST</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center font-bold text-track-dark/40 uppercase">Loading Results...</td>
                </tr>
              ) : displayAttempts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center font-bold text-track-dark/40 uppercase">No Athletes Registered</td>
                </tr>
              ) : displayAttempts.map((result, i) => (
                <tr key={i} className={`border-b-4 border-track-dark/10 hover:bg-track-foam transition-colors ${i === 0 ? 'bg-white' : 'bg-track-foam/50'}`}>
                  <td className="p-4 border-r-4 border-track-dark/10 font-black text-2xl text-track-dark">{result.pos}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-left">
                    <div className="font-black text-track-dark text-lg uppercase">{result.name}</div>
                    <div className="text-xs font-black text-track-dark/60 uppercase">{result.island}</div>
                  </td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a1)}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a2)}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a3)}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a4)}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a5)}</td>
                  <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a6)}</td>
                  <td className="p-4 text-right bg-track-lagoon/10">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-black text-2xl text-track-dark">{result.best}</span>
                      {result.pb && (
                        <span className="bg-track-coral text-white text-xs font-black px-2 py-1 transform -skew-x-6 shadow-[2px_2px_0px_#010F1A]">PB</span>
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
