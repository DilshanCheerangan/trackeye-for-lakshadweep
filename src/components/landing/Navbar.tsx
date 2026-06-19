import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'FEATURES', href: '#features' },
  { label: 'ISLANDS', href: '#islands' },
  { label: 'ANALYTICS', href: '#analytics' },
  { label: 'ATHLETES', href: '#athletes' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-track-foam border-b-8 border-track-dark">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white border-4 border-track-dark flex items-center justify-center overflow-hidden transform -skew-x-6 group-hover:border-track-coral transition-all">
            <img src="/lak_athletics_logo.png" alt="LAK Athletics Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <span className="text-3xl editorial-heading-bebas text-track-dark tracking-wider group-hover:text-track-coral transition-colors">
            TRACKEYE
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-black text-track-dark/65 uppercase tracking-widest hover:text-track-coral transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/dashboard?demo=false"
            className="bg-track-dark text-white font-black text-sm uppercase px-5 py-2.5 border-4 border-track-dark hover:bg-track-coral hover:border-track-coral transition-all shadow-[4px_4px_0px_#FF7A45] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            LAUNCH PLATFORM
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-track-dark p-2"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-track-foam border-t-8 border-track-dark px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-black text-track-dark/70 uppercase tracking-widest hover:text-track-coral transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/dashboard?demo=false"
            className="bg-track-dark text-white font-black text-sm uppercase px-5 py-3 text-center border-4 border-track-dark"
            onClick={() => setOpen(false)}
          >
            LAUNCH PLATFORM
          </Link>
        </div>
      )}
    </nav>
  );
}
