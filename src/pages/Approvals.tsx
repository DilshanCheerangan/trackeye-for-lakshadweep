import { CheckCircle, XCircle, AlertTriangle, UserCheck, Check, X, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Entry {
  id: string;
  athlete_name: string;
  island: string;
  event: string;
  age_group: string;
  checks: {
    age: 'PASS' | 'FAIL';
    duplicates: 'PASS' | 'FAIL';
    clash: 'PASS' | 'WARN';
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function Approvals() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/entries/`)
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAction = (entry_id: string, action: 'APPROVED' | 'REJECTED') => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/entries/${entry_id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action })
    })
    .then(res => res.json())
    .then(() => {
      setEntries(entries.map(e => e.entry_id === entry_id ? { ...e, status: action } : e));
      setToast(`${action} EVENT ENTRY ${entry_id}`);
    })
    .catch(err => console.error(err));
  };

  const getCheckIcon = (status: string) => {
    if (status === 'PASS') return <CheckCircle className="w-5 h-5 text-[#21A366]" />;
    if (status === 'FAIL') return <XCircle className="w-5 h-5 text-track-coral" />;
    if (status === 'WARN') return <AlertTriangle className="w-5 h-5 text-[#FFD700]" />;
    return null;
  };

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">APPROVALS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Eligibility Verification Dashboard</p>
        </div>
        <div className="flex gap-4">
          {toast && <div className="px-6 py-4 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6">{toast}</div>}
          <div className="flex items-center gap-4 bg-white border-4 border-track-dark p-2 shadow-[4px_4px_0px_#010F1A]">
            <div className="flex items-center gap-2 px-3 border-r-4 border-track-dark">
              <UserCheck className="w-5 h-5 text-track-dark stroke-[3]" />
              <span className="font-black text-lg">{entries.filter(e => e.status === 'PENDING').length} PENDING</span>
            </div>
            <div className="flex items-center gap-2 px-3">
              <Filter className="w-4 h-4 text-track-dark" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="p-8 text-center font-bold text-track-dark/40 uppercase">Loading Entries...</div>
        ) : entries.map((entry: any) => (
          <div key={entry.id} className={`brutal-card p-0 flex flex-col md:flex-row overflow-hidden border-8 transition-colors ${
            entry.status === 'PENDING' ? 'border-track-dark bg-white' : 
            entry.status === 'APPROVED' ? 'border-[#21A366] bg-[#21A366]/10' : 
            'border-track-coral bg-track-coral/10'
          }`}>
            
            {/* Info Section */}
            <div className="flex-1 p-6 md:border-r-8 border-track-dark/20 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-3xl editorial-heading-bebas text-track-dark mb-1">{entry.athlete_name}</h3>
                  <div className="flex gap-3">
                    <span className="font-black text-sm uppercase tracking-widest text-track-dark/60 bg-track-foam px-2 py-1 border-2 border-track-dark/20">
                      {entry.island}
                    </span>
                    <span className="font-black text-sm uppercase tracking-widest text-track-dark/60 bg-track-foam px-2 py-1 border-2 border-track-dark/20">
                      {entry.age_group}
                    </span>
                  </div>
                </div>
                <span className="font-black text-track-dark text-xl uppercase px-3 py-1 border-4 border-track-dark transform -skew-x-6 shadow-[2px_2px_0px_#010F1A]">
                  {entry.id}
                </span>
              </div>
              <div className="mt-4 border-t-4 border-track-dark/10 pt-4">
                 <p className="font-black text-track-lagoon text-lg uppercase flex items-center gap-2">
                   EVENT ENTRY: <span className="text-track-dark">{entry.event_name}</span>
                 </p>
              </div>
            </div>

            {/* Checks Section */}
            <div className="w-full md:w-80 p-6 bg-track-foam/50 flex flex-col justify-center gap-4">
              <h4 className="font-black text-sm uppercase tracking-widest text-track-dark/50 mb-2">AUTOMATED SYSTEM CHECKS</h4>
              
              <div className="flex justify-between items-center bg-white p-3 border-2 border-track-dark/20 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                <span className="font-bold text-sm uppercase">AGE VERIFICATION</span>
                <div className="flex items-center gap-2">
                  <span className={`font-black text-xs ${entry.age_check === 'PASS' ? 'text-[#21A366]' : 'text-track-coral'}`}>{entry.age_check}</span>
                  {getCheckIcon(entry.age_check)}
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-white p-3 border-2 border-track-dark/20 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                <span className="font-bold text-sm uppercase">ISLAND QUOTA LIMIT</span>
                <div className="flex items-center gap-2">
                  <span className={`font-black text-xs ${entry.dup_check === 'PASS' ? 'text-[#21A366]' : 'text-track-coral'}`}>{entry.dup_check}</span>
                  {getCheckIcon(entry.dup_check)}
                </div>
              </div>

              <div className="flex justify-between items-center bg-white p-3 border-2 border-track-dark/20 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                <span className="font-bold text-sm uppercase">SCHEDULE CLASH</span>
                <div className="flex items-center gap-2">
                  <span className={`font-black text-xs ${entry.clash_check === 'PASS' ? 'text-[#21A366]' : 'text-[#FFD700]'}`}>{entry.clash_check}</span>
                  {getCheckIcon(entry.clash_check)}
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="w-full md:w-48 bg-track-dark p-6 flex flex-row md:flex-col justify-center gap-4">
              {entry.status === 'PENDING' ? (
                <>
                  <button onClick={() => handleAction(entry.entry_id, 'APPROVED')} className="flex-1 bg-[#21A366] text-white font-black uppercase text-xl py-4 border-4 border-white shadow-[4px_4px_0px_#010F1A] hover:bg-white hover:text-[#21A366] hover:border-[#21A366] transition-colors flex justify-center items-center gap-2 transform -skew-x-6">
                    <Check className="w-6 h-6 stroke-[3]" /> APPROVE
                  </button>
                  <button onClick={() => handleAction(entry.entry_id, 'REJECTED')} className="flex-1 bg-track-coral text-white font-black uppercase text-xl py-4 border-4 border-white shadow-[4px_4px_0px_#010F1A] hover:bg-white hover:text-track-coral hover:border-track-coral transition-colors flex justify-center items-center gap-2 transform -skew-x-6">
                    <X className="w-6 h-6 stroke-[3]" /> REJECT
                  </button>
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <span className={`text-3xl font-black mb-2 ${entry.status === 'APPROVED' ? 'text-[#21A366]' : 'text-track-coral'}`}>
                    {entry.status}
                  </span>
                  <p className="text-white/50 font-bold text-xs uppercase">Decision Finalized</p>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
