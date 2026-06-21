import { FileText, Download, FileSpreadsheet, FileJson, Clock, Medal, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Reports() {
  const [toast, setToast] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | number>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
    
    // Fetch Competitions
    fetch(`${API_URL}/competitions/`)
      .then(res => res.json())
      .then(data => setCompetitions(data || []))
      .catch(err => console.error("Failed to fetch competitions:", err));

    // Fetch Events
    fetch(`${API_URL}/events/`)
      .then(res => res.json())
      .then(data => {
        const list = data || [];
        setEvents(list);
        if (list.length > 0) {
          setSelectedEventId(list[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to fetch events:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setResults([]);
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
    setLoading(true);
    fetch(`${API_URL}/events/${selectedEventId}/results`)
      .then(res => res.json())
      .then(data => {
        const formatted = (data || []).map((r: any) => {
          let displayMark = r.mark;
          if (r.mark && r.mark.includes(',')) {
            const parts = r.mark.split(',');
            const getNumeric = (val: string) => {
              if (!val || val === "-" || val === "X") return 0;
              const num = parseFloat(val.replace(/[^0-9.]/g, ''));
              return isNaN(num) ? 0 : num;
            };
            const v1 = getNumeric(parts[0]);
            const v2 = getNumeric(parts[1]);
            const v3 = getNumeric(parts[2]);
            let maxVal = 0;
            let bestStr = "-";
            if (v1 > maxVal) { maxVal = v1; bestStr = parts[0]; }
            if (v2 > maxVal) { maxVal = v2; bestStr = parts[1]; }
            if (v3 > maxVal) { maxVal = v3; bestStr = parts[2]; }
            if (bestStr === "-" && (parts[0] === "X" || parts[1] === "X" || parts[2] === "X")) {
              bestStr = "X";
            }
            displayMark = bestStr;
          }
          return { ...r, mark: displayMark };
        });
        const sorted = formatted.sort((a: any, b: any) => {
          if (a.position === 0 && b.position !== 0) return 1;
          if (a.position !== 0 && b.position === 0) return -1;
          if (a.position === 0 && b.position === 0) {
            return (a.lane_or_order || 999) - (b.lane_or_order || 999);
          }
          return a.position - b.position;
        });
        setResults(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch results:", err);
        setResults([]);
        setLoading(false);
      });
  }, [selectedEventId]);

  const selectedEvent = events.find(e => e.id === Number(selectedEventId));
  const selectedComp = selectedEvent ? competitions.find(c => c.id === selectedEvent.competition_id) : null;

  const podiumGold = results.find(r => r.position === 1);
  const podiumSilver = results.find(r => r.position === 2);
  const podiumBronze = results.find(r => r.position === 3);

  const reports = [
    { title: "OFFICIAL RESULTS - MEN'S 100M FINAL", time: "10 MINS AGO", type: "pdf", size: "1.2 MB" },
    { title: "START LIST - WOMEN'S LONG JUMP", time: "1 HOUR AGO", type: "pdf", size: "0.8 MB" },
    { title: "FULL MEET ANALYTICS EXPORT", time: "YESTERDAY", type: "excel", size: "4.5 MB" },
    { title: "ATHLETE PROGRESSION DATA", time: "YESTERDAY", type: "csv", size: "2.1 MB" },
  ];

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">EXPORTS & DOCS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Generate and download raw data.</p>
        </div>
        <div className="flex gap-4">
          {toast && <div className="px-6 py-4 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6">{toast}</div>}
          <button onClick={() => setToast("REPORT GENERATION SCHEDULED")} className="px-6 py-4 bg-track-foam border-4 border-track-dark font-black uppercase tracking-widest text-track-dark hover:bg-track-lagoon transition-all transform -skew-x-6 hover:-translate-y-1 shadow-[4px_4px_0px_#010F1A]">
            Generate Report
          </button>
          <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/stats/report/csv`} download className="inline-block px-6 py-4 bg-track-dark border-4 border-track-dark font-black uppercase tracking-widest text-white hover:bg-track-coral transition-all transform -skew-x-6 hover:-translate-y-1 shadow-[4px_4px_0px_#FF7A45]">
            Download CSV
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Instant Result Sheet Card */}
        <div className="brutal-card p-0 flex flex-col h-full bg-white relative overflow-hidden">
          {/* Medal watermark */}
          <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 text-track-foam opacity-50 pointer-events-none" />
          
          <div className="p-4 border-b-8 border-track-dark bg-track-lagoon flex justify-between items-center z-10 relative">
            <h3 className="font-black text-3xl editorial-heading-bebas text-track-dark">INSTANT RESULT SHEET</h3>
            <span className="bg-track-dark text-track-lagoon px-3 py-1 font-black text-sm uppercase transform -skew-x-6">AUTO-GENERATED</span>
          </div>
          <div className="p-6 flex-1 z-10 relative">
            {/* Event Selector Dropdown */}
            <div className="mb-6 flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-track-dark/60 tracking-wider">Select Track or Field Event</label>
              <select 
                value={selectedEventId} 
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full p-3 border-4 border-track-dark bg-white font-black text-track-dark shadow-[4px_4px_0px_#010F1A] focus:outline-none uppercase"
              >
                <option value="" disabled>-- Choose Event --</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} ({evt.status})
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12 font-black text-track-dark/40 uppercase">Loading Results...</div>
            ) : !selectedEventId || events.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <Trophy className="w-16 h-16 text-track-dark/20 mb-4 animate-bounce" />
                <p className="font-black text-xl text-track-dark uppercase">No events available</p>
                <p className="text-sm font-bold text-track-dark/60 uppercase mt-1">Please add events and save official results first.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-end border-b-4 border-track-dark pb-4 mb-4">
                  <div>
                    <h4 className="text-2xl font-black text-track-dark uppercase tracking-wider">{selectedEvent.name}</h4>
                    <div className="flex gap-4 mt-2 text-sm font-bold text-track-dark/60 uppercase">
                      <span>DATE: {selectedComp ? selectedComp.date_str : "TODAY"}</span>
                      {selectedEvent.event_type === 'TRACK' && <span>WIND: +1.2</span>}
                      <span>VENUE: {selectedComp ? selectedComp.location : "MAIN STADIUM"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setToast(`GENERATING PDF FOR ${selectedEvent.name}...`)} className="p-2 border-4 border-track-dark bg-track-coral text-white hover:bg-track-dark transition-colors shadow-[2px_2px_0px_#010F1A]" title="Export PDF">
                      <FileText className="w-5 h-5 stroke-[3]" />
                    </button>
                    <button onClick={() => setToast(`GENERATING EXCEL FOR ${selectedEvent.name}...`)} className="p-2 border-4 border-track-dark bg-[#21A366] text-white hover:bg-track-dark transition-colors shadow-[2px_2px_0px_#010F1A]" title="Export Excel">
                      <FileSpreadsheet className="w-5 h-5 stroke-[3]" />
                    </button>
                  </div>
                </div>

                {/* Medalists */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-track-foam border-4 border-track-dark p-3 flex flex-col items-center text-center transform -skew-x-2">
                    <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center border-2 border-track-dark mb-2 shadow-[2px_2px_0px_#010F1A]">
                      <Medal className="w-5 h-5 text-track-dark stroke-[3]" />
                    </div>
                    <span className="text-xs font-black text-track-dark/60 uppercase">GOLD</span>
                    <span className="font-black text-sm uppercase mt-1 truncate max-w-full">
                      {podiumGold ? podiumGold.athlete_name : "-"}
                    </span>
                    <span className="font-black text-track-coral text-lg">
                      {podiumGold ? podiumGold.mark : "-"}
                    </span>
                  </div>
                  <div className="bg-track-foam border-4 border-track-dark p-3 flex flex-col items-center text-center transform -skew-x-2">
                    <div className="w-10 h-10 bg-[#C0C0C0] rounded-full flex items-center justify-center border-2 border-track-dark mb-2 shadow-[2px_2px_0px_#010F1A]">
                      <Medal className="w-5 h-5 text-track-dark stroke-[3]" />
                    </div>
                    <span className="text-xs font-black text-track-dark/60 uppercase">SILVER</span>
                    <span className="font-black text-sm uppercase mt-1 truncate max-w-full">
                      {podiumSilver ? podiumSilver.athlete_name : "-"}
                    </span>
                    <span className="font-black text-track-coral text-lg">
                      {podiumSilver ? podiumSilver.mark : "-"}
                    </span>
                  </div>
                  <div className="bg-track-foam border-4 border-track-dark p-3 flex flex-col items-center text-center transform -skew-x-2">
                    <div className="w-10 h-10 bg-[#CD7F32] rounded-full flex items-center justify-center border-2 border-track-dark mb-2 shadow-[2px_2px_0px_#010F1A]">
                      <Medal className="w-5 h-5 text-track-dark stroke-[3]" />
                    </div>
                    <span className="text-xs font-black text-track-dark/60 uppercase">BRONZE</span>
                    <span className="font-black text-sm uppercase mt-1 truncate max-w-full">
                      {podiumBronze ? podiumBronze.athlete_name : "-"}
                    </span>
                    <span className="font-black text-track-coral text-lg">
                      {podiumBronze ? podiumBronze.mark : "-"}
                    </span>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full text-left border-collapse bg-white border-4 border-track-dark">
                  <thead>
                    <tr className="bg-track-foam border-b-4 border-track-dark">
                      <th className="p-2 font-black text-xs uppercase tracking-widest text-track-dark border-r-4 border-track-dark text-center">RK</th>
                      <th className="p-2 font-black text-xs uppercase tracking-widest text-track-dark border-r-4 border-track-dark text-center">LN/ORD</th>
                      <th className="p-2 font-black text-xs uppercase tracking-widest text-track-dark border-r-4 border-track-dark">ATHLETE</th>
                      <th className="p-2 font-black text-xs uppercase tracking-widest text-track-dark text-right">MARK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center font-bold text-track-dark/40 uppercase">
                          No results recorded for this event
                        </td>
                      </tr>
                    ) : (
                      results.map((row, i) => (
                        <tr key={i} className="border-b-2 border-track-dark/20 hover:bg-track-foam/50 transition-colors">
                          <td className="p-2 border-r-4 border-track-dark font-black text-center bg-track-foam/30">{row.position}</td>
                          <td className="p-2 border-r-4 border-track-dark font-bold text-track-dark/60 text-center">{row.lane_or_order || "-"}</td>
                          <td className="p-2 border-r-4 border-track-dark font-bold uppercase">{row.athlete_name}</td>
                          <td className="p-2 font-black text-track-coral text-right">{row.mark}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>

        {/* Existing Export types card group */}
        <div className="flex flex-col gap-6">
          <div onClick={() => setToast("GENERATING PDF REPORT BUNDLE")} className="brutal-card p-6 flex items-center gap-6 cursor-pointer hover:bg-track-coral hover:text-white group flex-1">
            <div className="w-16 h-16 bg-track-dark flex items-center justify-center transform -skew-x-12 shadow-[4px_4px_0px_#010F1A] group-hover:shadow-[4px_4px_0px_white]">
              <FileText className="w-8 h-8 text-track-coral group-hover:text-white stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-2xl editorial-heading-bebas text-track-dark group-hover:text-white">PDF REPORTS</h3>
              <p className="text-sm font-black text-track-dark/60 uppercase group-hover:text-white/80">Official start lists and results</p>
            </div>
          </div>
          
          <div className="brutal-card p-6 flex items-center gap-6 cursor-pointer hover:bg-[#21A366] hover:text-white group flex-1">
            <div className="w-16 h-16 bg-track-dark flex items-center justify-center transform -skew-x-12 shadow-[4px_4px_0px_#010F1A] group-hover:shadow-[4px_4px_0px_white]">
              <FileSpreadsheet className="w-8 h-8 text-[#21A366] group-hover:text-white stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-2xl editorial-heading-bebas text-track-dark group-hover:text-white">EXCEL EXPORTS</h3>
              <p className="text-sm font-black text-track-dark/60 uppercase group-hover:text-white/80">Formatted meet data and analytics</p>
            </div>
          </div>
          
          <div className="brutal-card p-6 flex items-center gap-6 cursor-pointer hover:bg-track-sand hover:text-track-dark group flex-1">
            <div className="w-16 h-16 bg-track-dark flex items-center justify-center transform -skew-x-12 shadow-[4px_4px_0px_#010F1A] group-hover:shadow-[4px_4px_0px_white]">
              <FileJson className="w-8 h-8 text-track-sand group-hover:text-track-dark stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-2xl editorial-heading-bebas text-track-dark">RAW CSV/JSON</h3>
              <p className="text-sm font-black text-track-dark/60 uppercase group-hover:text-track-dark/80">Raw timing and tracking data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="brutal-card p-0 overflow-hidden">
        <div className="p-4 border-b-8 border-track-dark bg-track-foam">
          <h3 className="font-black text-3xl editorial-heading-bebas text-track-dark">RECENT EXPORTS</h3>
        </div>
        <div className="bg-white">
          {reports.map((report, i) => (
            <div key={i} className={`flex items-center justify-between p-6 border-b-4 border-track-dark/10 hover:bg-track-foam transition-colors group ${i === reports.length - 1 ? 'border-b-0' : ''}`}>
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 flex items-center justify-center transform -skew-x-6 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] ${
                  report.type === 'pdf' ? 'bg-track-coral text-white' :
                  report.type === 'excel' ? 'bg-[#21A366] text-white' :
                  'bg-track-sand text-track-dark'
                }`}>
                  {report.type === 'pdf' ? <FileText className="w-6 h-6 stroke-[2.5]" /> : 
                   report.type === 'excel' ? <FileSpreadsheet className="w-6 h-6 stroke-[2.5]" /> : 
                   <FileJson className="w-6 h-6 stroke-[2.5]" />}
                </div>
                <div>
                  <h4 className="font-black text-xl text-track-dark group-hover:text-track-coral transition-colors">{report.title}</h4>
                  <div className="flex items-center gap-4 text-xs font-bold text-track-dark/50 mt-1 uppercase tracking-widest">
                    <span>{report.type}</span>
                    <span>{report.size}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {report.time}</span>
                  </div>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setToast(`DOWNLOADING: ${report.title}`); }} className="brutal-button p-3 bg-white hover:bg-track-lagoon shadow-[4px_4px_0px_#010F1A]">
                <Download className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
