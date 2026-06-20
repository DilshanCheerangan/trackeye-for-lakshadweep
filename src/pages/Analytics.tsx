import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Analytics() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<string>("");
  const [velocityData, setVelocityData] = useState<any[]>([]);
  const [seasonProgression, setSeasonProgression] = useState<any[]>([]);

  const displayAthletes = athletes;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/athletes/`)
      .then(res => res.json())
      .then(data => {
        setAthletes(data);
        if (data.length > 0) {
          setSelectedAthlete(data[0].id.toString());
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (selectedAthlete) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/athletes/${selectedAthlete}/analytics`)
        .then(res => res.json())
        .then(data => {
          setVelocityData(data.velocity || []);
          setSeasonProgression(data.progression || []);
        })
        .catch(err => console.error(err));
    }
  }, [selectedAthlete]);

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">PERFORMANCE METRICS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Deep dive into athlete kinematics.</p>
        </div>
        <div className="flex gap-4 bg-white border-4 border-track-dark p-2 shadow-[4px_4px_0px_#010F1A] items-center">
          <Filter className="w-5 h-5 text-track-dark stroke-[3] ml-1" />
          <select 
            value={selectedAthlete}
            onChange={e => setSelectedAthlete(e.target.value)}
            className="bg-transparent border-none font-black text-track-dark focus:outline-none uppercase text-sm cursor-pointer"
          >
            {displayAthletes.map((a, idx) => (
              <option key={idx} value={a.id}>{a.name}</option>
            ))}
            {displayAthletes.length === 0 && <option value="">NO ATHLETES FOUND</option>}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="brutal-card p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-end mb-8 border-b-4 border-track-dark pb-4">
            <h3 className="text-3xl editorial-heading-bebas text-track-dark">VELOCITY CURVE - {selectedAthlete}</h3>
            <span className="bg-track-lagoon text-track-dark font-black px-3 py-1 text-sm uppercase transform -skew-x-12 shadow-[2px_2px_0px_#010F1A]">KM/H vs DISTANCE</span>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#010F1A" opacity={0.1} vertical={false} />
                <XAxis dataKey="split" stroke="#010F1A" opacity={0.8} tick={{fill: '#010F1A', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#010F1A" opacity={0.8} tick={{fill: '#010F1A', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#FF7A45" opacity={0.8} tick={{fill: '#FF7A45', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F8FAFC', borderColor: '#010F1A', borderWidth: '4px', borderRadius: '0px', color: '#010F1A', fontWeight: 'bold' }}
                  itemStyle={{ color: '#010F1A', fontWeight: 'black' }}
                />
                <Legend iconType="square" wrapperStyle={{ fontWeight: 'black', paddingTop: '20px' }} />
                <Line yAxisId="left" type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#00C8C8" strokeWidth={5} dot={{ r: 4, fill: '#00C8C8' }} activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="avgSpeed" name="Avg Speed (km/h)" stroke="#010F1A" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="brutal-card p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-end mb-8 border-b-4 border-track-dark pb-4">
            <h3 className="text-3xl editorial-heading-bebas text-track-dark">SEASON PROGRESSION</h3>
            <span className="bg-track-coral text-white font-black px-3 py-1 text-sm uppercase transform -skew-x-12 shadow-[2px_2px_0px_#010F1A]">DIAMOND LEAGUE</span>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#010F1A" opacity={0.1} vertical={false} />
                <XAxis dataKey="meet" stroke="#010F1A" opacity={0.8} tick={{fill: '#010F1A', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis domain={[9.7, 10.3]} stroke="#010F1A" opacity={0.8} tick={{fill: '#010F1A', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(1,15,26,0.1)'}} 
                  contentStyle={{ backgroundColor: '#F8FAFC', borderColor: '#010F1A', borderWidth: '4px', borderRadius: '0px', color: '#010F1A', fontWeight: 'bold' }}
                  itemStyle={{ color: '#010F1A', fontWeight: 'black' }}
                />
                <Bar dataKey="time" name="Time (s)">
                  {
                    seasonProgression.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pb ? '#FF7A45' : '#010F1A'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
