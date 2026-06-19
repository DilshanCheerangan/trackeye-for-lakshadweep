import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Activity, 
  Target, 
  Video, 
  PlaySquare, 
  LineChart, 
  FileText, 
  Settings,
  Map,
  CheckSquare,
  ListOrdered
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Competitions', path: '/dashboard/competitions', icon: Trophy },
  { name: 'Islands', path: '/dashboard/islands', icon: Map },
  { name: 'Athletes', path: '/dashboard/athletes', icon: Users },
  { name: 'Approvals', path: '/dashboard/approvals', icon: CheckSquare },
  { name: 'Start Lists', path: '/dashboard/start-lists', icon: ListOrdered },
  { name: 'Track Events', path: '/dashboard/track-events', icon: Activity },
  { name: 'Field Events', path: '/dashboard/field-events', icon: Target },
  { name: 'Live Capture', path: '/dashboard/live-capture', icon: Video },
  { name: 'Video Analysis', path: '/dashboard/video-analysis', icon: PlaySquare },
  { name: 'Analytics', path: '/dashboard/analytics', icon: LineChart },
  { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const activeMeetName = sessionStorage.getItem('enteredCompetitionName');

  return (
    <aside className="w-64 bg-track-foam border-r-8 border-track-dark hidden md:flex flex-col h-screen sticky top-0 shadow-[8px_0px_0px_rgba(0,0,0,0.05)] z-20">
      <div className="p-6 border-b-8 border-track-dark bg-track-coral transform">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white border-4 border-track-dark flex items-center justify-center transform -skew-x-6 group-hover:bg-track-dark transition-colors">
            <Activity className="w-6 h-6 text-track-dark group-hover:text-white stroke-[3] transition-colors" />
          </div>
          <span className="text-3xl editorial-heading-bebas text-track-dark group-hover:text-white transition-colors">
            TRACKEYE
          </span>
        </NavLink>
      </div>

      {activeMeetName && (
        <div className="mx-4 mt-4 p-3 bg-track-coral text-white border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] font-black uppercase text-xs flex flex-col gap-2 relative">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <div className="text-[10px] text-track-dark tracking-widest font-black">ACTIVE MEET</div>
              <div className="mt-1 font-editorial-bebas text-xl leading-none text-track-dark tracking-wide uppercase">{activeMeetName}</div>
            </div>
            <button 
              onClick={() => {
                sessionStorage.removeItem('enteredCompetitionId');
                sessionStorage.removeItem('enteredCompetitionName');
                navigate('/dashboard/competitions');
              }}
              className="w-5 h-5 bg-white text-track-dark border-2 border-track-dark flex items-center justify-center font-black hover:bg-track-dark hover:text-white transition-colors cursor-pointer text-xs"
              title="Exit active meet"
            >
              X
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 border-4 transition-all duration-300 font-bold uppercase tracking-tight transform ${
                isActive
                  ? 'bg-track-dark text-white border-track-dark shadow-[4px_4px_0px_#00C8C8] -translate-y-1'
                  : 'bg-white text-track-dark border-transparent hover:border-track-dark hover:shadow-[4px_4px_0px_#010F1A] hover:-translate-y-1'
              }`
            }
          >
            <item.icon className="w-5 h-5 stroke-[2.5]" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
