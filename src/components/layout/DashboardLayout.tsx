import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const demoParam = params.get('demo');
    if (demoParam === 'true') {
      sessionStorage.setItem('demoMode', 'true');
    } else if (demoParam === 'false') {
      sessionStorage.setItem('demoMode', 'false');
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-track-dark">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-0">
        <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative bg-track-foam">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
