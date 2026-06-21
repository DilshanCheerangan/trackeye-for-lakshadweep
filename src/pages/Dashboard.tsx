import { Users, Trophy, Activity, CheckCircle, Star } from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import { useState, useEffect } from 'react';


export default function Dashboard() {
  const [stats, setStats] = useState({
    total_athletes: 0,
    total_competitions: 0,
    active_events: 0,
    live_streams: 0,
    results_published: 0,
    new_records: 0
  });

  const [competitions, setCompetitions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/stats/`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats:", err);
      });

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/competitions/`)
      .then(res => res.json())
      .then(data => {
        setCompetitions(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch competitions:", err);
      });

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/events/`)
      .then(res => res.json())
      .then(data => {
        setEvents(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch events:", err);
      });
  }, []);

  const displayStats = stats;

  const metrics = [
    { title: "Total Athletes", value: displayStats.total_athletes, icon: <Users />, trend: displayStats.total_athletes > 0 ? `+${displayStats.total_athletes}` : "0", trendUp: true },
    { title: "Competitions", value: displayStats.total_competitions, icon: <Trophy />, trend: displayStats.total_competitions > 0 ? `+${displayStats.total_competitions}` : "0", trendUp: true },
    { title: "Active Events", value: displayStats.active_events, icon: <Activity />, trend: "LIVE" },
    { title: "Results Published", value: displayStats.results_published, icon: <CheckCircle /> },
    { title: "New Records", value: displayStats.new_records, icon: <Star />, trend: "HOT" },
  ];
  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">COMMAND CENTER</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">
            Live overview of all active competitions.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-track-coral text-white border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] transform -skew-x-6">
          <div className="w-3 h-3 bg-white animate-pulse"></div>
          <span className="text-lg font-black uppercase tracking-wider">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        {/* Track Events Column */}
        <div className="brutal-card p-0 flex flex-col h-[500px] bg-white">
          <div className="flex justify-between items-center p-6 border-b-8 border-track-dark bg-track-lagoon">
            <h3 className="text-3xl editorial-heading-bebas text-track-dark">LIVE TRACK EVENTS</h3>
            <span className="text-lg font-black text-white bg-track-coral px-3 py-1 border-2 border-track-dark transform -skew-x-12 shadow-[2px_2px_0px_#010F1A]">LIVE FEED</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {events.filter(e => e.event_type === 'TRACK').length === 0 ? (
              <div className="text-center font-bold text-track-dark/40 py-8 uppercase tracking-wider">NO TRACK EVENTS FOUND</div>
            ) : events.filter(e => e.event_type === 'TRACK').map((evt, i) => {
              const comp = competitions.find(c => c.id === evt.competition_id);
              return (
                <div key={i} className="bg-track-foam p-4 border-4 border-track-dark hover:-translate-y-1 hover:shadow-[4px_4px_0px_#010F1A] transition-all cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-track-dark uppercase text-lg">{evt.name}</h4>
                    <span className={`text-sm font-bold bg-white px-2 py-0.5 border-2 border-track-dark uppercase ${
                      evt.status === 'LIVE' ? 'text-track-coral border-track-coral' :
                      evt.status === 'OFFICIAL' ? 'text-[#21A366] border-[#21A366]' :
                      'text-track-dark/60 border-track-dark/60'
                    }`}>
                      {evt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 border-2 border-track-dark ${
                      evt.status === 'LIVE' ? 'bg-track-coral animate-pulse' :
                      evt.status === 'OFFICIAL' ? 'bg-[#21A366]' :
                      'bg-track-lagoon'
                    }`}></div>
                    <span className="text-sm font-black text-track-dark/80">
                      {comp ? `${comp.name} • ${comp.location} • ${comp.date_str}` : 'TRACK EVENT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Field Events Column */}
        <div className="brutal-card p-0 flex flex-col h-[500px] bg-white">
          <div className="flex justify-between items-center p-6 border-b-8 border-track-dark bg-track-coral">
            <h3 className="text-3xl editorial-heading-bebas text-white">LIVE FIELD EVENTS</h3>
            <span className="text-lg font-black text-track-dark bg-white px-3 py-1 border-2 border-track-dark transform -skew-x-12 shadow-[2px_2px_0px_#010F1A]">LIVE FEED</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {events.filter(e => e.event_type === 'FIELD').length === 0 ? (
              <div className="text-center font-bold text-track-dark/40 py-8 uppercase tracking-wider">NO FIELD EVENTS FOUND</div>
            ) : events.filter(e => e.event_type === 'FIELD').map((evt, i) => {
              const comp = competitions.find(c => c.id === evt.competition_id);
              return (
                <div key={i} className="bg-track-foam p-4 border-4 border-track-dark hover:-translate-y-1 hover:shadow-[4px_4px_0px_#010F1A] transition-all cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-track-dark uppercase text-lg">{evt.name}</h4>
                    <span className={`text-sm font-bold bg-white px-2 py-0.5 border-2 border-track-dark uppercase ${
                      evt.status === 'LIVE' ? 'text-track-coral border-track-coral' :
                      evt.status === 'OFFICIAL' ? 'text-[#21A366] border-[#21A366]' :
                      'text-track-dark/60 border-track-dark/60'
                    }`}>
                      {evt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 border-2 border-track-dark ${
                      evt.status === 'LIVE' ? 'bg-track-coral animate-pulse' :
                      evt.status === 'OFFICIAL' ? 'bg-[#21A366]' :
                      'bg-track-lagoon'
                    }`}></div>
                    <span className="text-sm font-black text-track-dark/80">
                      {comp ? `${comp.name} • ${comp.location} • ${comp.date_str}` : 'FIELD EVENT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
