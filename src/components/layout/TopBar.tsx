import { Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation();
  const getTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'COMMAND CENTER';
    return path.replace('-', ' ').toUpperCase();
  };

  return (
    <header className="h-20 bg-track-foam border-b-8 border-track-dark sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 bg-white border-4 border-track-dark hover:bg-track-lagoon transition-colors shadow-[4px_4px_0px_#010F1A] cursor-pointer"
        >
          <Menu className="w-6 h-6 stroke-[3]" />
        </button>
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-black text-track-dark/50 uppercase tracking-widest">CURRENT VIEW</span>
          <h2 className="text-3xl editorial-heading-bebas text-track-dark leading-none">{getTitle()}</h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-track-dark/50 stroke-[3]" />
          <input 
            type="text" 
            placeholder="SEARCH ATHLETES, EVENTS..." 
            className="pl-10 pr-4 py-2 bg-white border-4 border-track-dark text-track-dark font-bold placeholder-track-dark/50 focus:outline-none focus:ring-0 w-64 shadow-[4px_4px_0px_#010F1A] focus:shadow-none focus:translate-y-1 focus:translate-x-1 transition-all uppercase text-sm"
          />
        </div>
        
        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
}
