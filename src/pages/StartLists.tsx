import { Printer, Timer, Target } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StartLists() {
  const [activeTab, setActiveTab] = useState<'TRACK' | 'FIELD'>('TRACK');
  const [sprintHeats, setSprintHeats] = useState<any[]>([]);
  const [fieldOrders, setFieldOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/entries/start-lists`)
      .then(res => res.json())
      .then(data => {
        setSprintHeats(data.tracks || []);
        setFieldOrders(data.fields || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Removed hardcoded arrays

  const [toast, setToast] = useState("");

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">START LISTS</h1>
          <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">Generated from Approved Entries</p>
        </div>
        <div className="flex gap-4">
          {toast && <div className="px-6 py-4 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse transform -skew-x-6">{toast}</div>}
          <button onClick={() => {
            setToast("SENDING TO PRINTER");
            setTimeout(() => setToast(""), 3000);
          }} className="flex items-center gap-2 bg-track-dark text-white px-6 py-4 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all transform -skew-x-6">
            <Printer className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest">PRINT ALL</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('TRACK')} 
          className={`flex items-center gap-2 px-8 py-4 font-black uppercase text-xl border-4 transform -skew-x-6 transition-all ${activeTab === 'TRACK' ? 'bg-track-coral text-white border-track-dark shadow-[4px_4px_0px_#010F1A]' : 'bg-white text-track-dark border-track-dark hover:bg-track-foam shadow-[4px_4px_0px_#010F1A]'}`}
        >
          <Timer className="w-6 h-6 stroke-[3]" /> TRACK EVENTS
        </button>
        <button 
          onClick={() => setActiveTab('FIELD')} 
          className={`flex items-center gap-2 px-8 py-4 font-black uppercase text-xl border-4 transform -skew-x-6 transition-all ${activeTab === 'FIELD' ? 'bg-track-coral text-white border-track-dark shadow-[4px_4px_0px_#010F1A]' : 'bg-white text-track-dark border-track-dark hover:bg-track-foam shadow-[4px_4px_0px_#010F1A]'}`}
        >
          <Target className="w-6 h-6 stroke-[3]" /> FIELD EVENTS
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-2 p-8 text-center font-bold text-track-dark/40 uppercase">Loading Start Lists...</div>
        ) : activeTab === 'TRACK' ? (
          sprintHeats.length > 0 ? sprintHeats.map((heat, i) => (
            <div key={i} className="brutal-card p-0 bg-white relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-2 h-full bg-track-dark group-hover:bg-track-coral transition-colors"></div>
               <div className="p-4 border-b-4 border-track-dark bg-track-foam flex justify-between items-center ml-2">
                 <h3 className="font-black text-2xl editorial-heading-bebas text-track-dark">{heat.name}</h3>
                 <span className="bg-track-dark text-white px-3 py-1 font-black text-sm uppercase transform -skew-x-6 shadow-[2px_2px_0px_#FF7A45] flex items-center gap-2">
                   <Timer className="w-4 h-4" /> {heat.time}
                 </span>
               </div>
               <div className="p-6 ml-2">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b-2 border-track-dark/20 text-track-dark/50 text-xs font-black uppercase tracking-widest">
                       <th className="pb-2 w-16">LANE</th>
                       <th className="pb-2">ATHLETE</th>
                       <th className="pb-2 text-right">ISLAND</th>
                     </tr>
                   </thead>
                   <tbody>
                     {heat.athletes.map((athlete: any, j: number) => (
                       <tr key={j} className="border-b-2 border-track-dark/10 hover:bg-track-foam/50 transition-colors">
                         <td className="py-3 font-black text-xl text-track-dark">
                           <div className="w-8 h-8 bg-track-dark text-white flex items-center justify-center transform -skew-x-6">
                             {athlete.lane}
                           </div>
                         </td>
                         <td className="py-3 font-bold text-lg text-track-dark uppercase">{athlete.name}</td>
                         <td className="py-3 text-right font-black text-sm text-track-dark/60 uppercase tracking-widest">{athlete.island}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )) : <div className="col-span-2 p-8 text-center font-bold text-track-dark/40 uppercase">No Track Events Generated</div>
        ) : (
          fieldOrders.length > 0 ? fieldOrders.map((event, i) => (
          <div key={i} className="brutal-card p-0 bg-white relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-2 h-full bg-track-lagoon transition-colors"></div>
             <div className="p-4 border-b-4 border-track-dark bg-track-foam flex justify-between items-center ml-2">
               <h3 className="font-black text-2xl editorial-heading-bebas text-track-dark">{event.name}</h3>
               <span className="bg-track-dark text-white px-3 py-1 font-black text-sm uppercase transform -skew-x-6 shadow-[2px_2px_0px_#00C8C8] flex items-center gap-2">
                 <Timer className="w-4 h-4" /> {event.time}
               </span>
             </div>
             <div className="p-6 ml-2">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b-2 border-track-dark/20 text-track-dark/50 text-xs font-black uppercase tracking-widest">
                     <th className="pb-2 w-16 text-center">ORDER</th>
                     <th className="pb-2">ATHLETE</th>
                     <th className="pb-2 text-right">ISLAND</th>
                   </tr>
                 </thead>
                 <tbody>
                   {event.athletes.map((athlete: any, j: number) => (
                     <tr key={j} className="border-b-2 border-track-dark/10 hover:bg-track-foam/50 transition-colors">
                       <td className="py-3 font-black text-xl text-track-dark text-center">{athlete.order}</td>
                       <td className="py-3 font-bold text-lg text-track-dark uppercase">{athlete.name}</td>
                       <td className="py-3 text-right font-black text-sm text-track-dark/60 uppercase tracking-widest">{athlete.island}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
          )) : <div className="col-span-2 p-8 text-center font-bold text-track-dark/40 uppercase">No Field Events Generated</div>
        )}
      </div>
    </div>
  );
}
