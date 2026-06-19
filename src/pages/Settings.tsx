import { Save, Camera, Cpu, Globe, Shield, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

const tabs = [
  { id: 'general', label: 'GENERAL', icon: <Globe className="w-5 h-5" /> },
  { id: 'camera', label: 'CAMERA SYNC', icon: <Camera className="w-5 h-5" /> },
  { id: 'processing', label: 'AI PROCESSING', icon: <Cpu className="w-5 h-5" /> },
  { id: 'security', label: 'SECURITY', icon: <Shield className="w-5 h-5" /> },
  { id: 'notifications', label: 'NOTIFICATIONS', icon: <Bell className="w-5 h-5" /> },
];

export default function Settings() {
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none">SYSTEM SETTINGS</h1>
        <p className="text-xl font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-2">
          Configure platform defaults and hardware integrations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-track-dark p-2 shadow-[8px_8px_0px_#010F1A]">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left font-black uppercase tracking-widest transition-colors ${
                  i === 0 
                    ? 'bg-track-coral text-white border-2 border-transparent' 
                    : 'text-white/60 hover:text-white hover:bg-white/10 border-2 border-transparent hover:border-white/20'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:w-3/4">
          <div className="brutal-card p-8 bg-white">
            <div className="flex justify-between items-end mb-8 border-b-4 border-track-dark pb-4">
              <h2 className="text-4xl editorial-heading-bebas text-track-dark">GENERAL PREFERENCES</h2>
            </div>

            <div className="space-y-8">
              {/* Form Group 1 */}
              <div className="space-y-2">
                <label className="block text-track-dark font-black text-sm uppercase tracking-widest">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="TrackEye Athletics Command" 
                  className="w-full bg-track-foam border-4 border-track-dark p-4 font-bold text-track-dark focus:outline-none focus:ring-4 focus:ring-track-lagoon/50 transition-all"
                />
              </div>

              {/* Form Group 2 */}
              <div className="space-y-2">
                <label className="block text-track-dark font-black text-sm uppercase tracking-widest">Default Timezone</label>
                <select className="w-full bg-track-foam border-4 border-track-dark p-4 font-bold text-track-dark focus:outline-none focus:ring-4 focus:ring-track-lagoon/50 transition-all appearance-none cursor-pointer">
                  <option>Asia/Kolkata (IST)</option>
                  <option>UTC</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="pt-4 space-y-6">
                <h3 className="font-black text-track-dark/60 uppercase tracking-widest border-b-2 border-track-dark/10 pb-2">Hardware</h3>
                
                <div className="flex items-center justify-between p-4 border-4 border-track-dark bg-track-foam hover:shadow-[4px_4px_0px_#010F1A] transition-all">
                  <div>
                    <h4 className="font-black text-track-dark uppercase text-lg">Auto-Sync Cameras</h4>
                    <p className="text-sm font-bold text-track-dark/60">Automatically connect to registered finish-line cameras on startup.</p>
                  </div>
                  <div className="w-16 h-8 bg-track-lagoon border-4 border-track-dark relative cursor-pointer">
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-track-dark"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border-4 border-track-dark bg-track-foam hover:shadow-[4px_4px_0px_#010F1A] transition-all">
                  <div>
                    <h4 className="font-black text-track-dark uppercase text-lg">AI Confidence Threshold</h4>
                    <p className="text-sm font-bold text-track-dark/60">Require manual review for photo finishes under 98% AI confidence.</p>
                  </div>
                  <div className="w-16 h-8 bg-track-coral border-4 border-track-dark relative cursor-pointer">
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-track-dark"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 mt-8 border-t-4 border-track-dark flex justify-end gap-4 items-center">
                {toast && <div className="px-4 py-2 bg-track-lagoon border-4 border-track-dark font-black text-track-dark animate-pulse text-sm transform -skew-x-6">{toast}</div>}
                <button onClick={() => setToast("CHANGES DISCARDED")} className="px-6 py-3 font-black text-track-dark uppercase tracking-widest border-4 border-track-dark hover:bg-track-foam transition-colors">
                  CANCEL
                </button>
                <button onClick={() => setToast("SETTINGS SAVED SUCCESSFULLY")} className="px-8 py-3 bg-track-coral text-white font-black uppercase tracking-widest border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-2">
                  <Save className="w-5 h-5 stroke-[3]" /> SAVE CHANGES
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
