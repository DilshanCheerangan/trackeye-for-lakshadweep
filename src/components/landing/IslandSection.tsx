import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IslandSection() {
  return (
    <section id="islands" className="relative overflow-hidden bg-track-dark">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=1600&h=800"
          alt="Lakshadweep tropical island coastline"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-track-dark via-track-dark/80 to-track-dark/40" />
      </div>

      {/* Diagonal coral accent */}
      <div className="absolute top-0 right-0 w-48 h-full bg-track-coral opacity-10 transform skew-x-12 translate-x-24 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:w-1/2 will-change-transform"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-track-lagoon stroke-[3]" />
            <span className="text-track-lagoon font-black text-sm uppercase tracking-widest">Lakshadweep, India</span>
          </div>

          <h2 className="editorial-heading text-white leading-[0.85] mb-8">
            <span className="block text-5xl md:text-7xl">BUILT FOR</span>
            <span className="block text-5xl md:text-7xl">ISLANDS.</span>
            <span className="block text-5xl md:text-7xl text-track-coral mt-2">READY FOR</span>
            <span className="block text-5xl md:text-7xl text-track-coral">CHAMPIONSHIPS.</span>
          </h2>

          <p className="text-white/60 font-bold text-lg uppercase leading-relaxed mb-10 max-w-lg border-l-4 border-track-lagoon pl-4">
            Inspiring Lakshadweep's generation of sprinters, jumpers, and champions with data, precision, and technology built specifically for island athletics environments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="brutal-button bg-track-coral text-white px-8 py-4 text-base uppercase tracking-widest font-black flex items-center gap-3 group shadow-[6px_6px_0px_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              EXPLORE PLATFORM
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="http://www.lakathletics.com/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-button bg-transparent text-track-lagoon border-4 border-track-lagoon px-8 py-4 text-base uppercase tracking-widest font-black hover:bg-track-lagoon hover:text-track-dark transition-all"
            >
              LAK ATHLETICS ASSOC.
            </a>
          </div>
        </motion.div>

        {/* Right: Stat cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="lg:w-[40%] grid grid-cols-2 gap-4 will-change-transform"
        >
          {[
            { label: 'ISLANDS', value: '36', color: 'bg-track-lagoon text-track-dark' },
            { label: 'KM FROM MAINLAND', value: '220+', color: 'bg-track-coral text-white' },
            { label: 'ATHLETES TRACKED', value: '200+', color: 'bg-white text-track-dark' },
            { label: 'NATIONAL MEDALS', value: '3+', color: 'bg-track-dark border-4 border-track-lagoon text-white' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 border-4 border-track-dark shadow-[8px_8px_0px_rgba(0,0,0,0.3)] flex flex-col justify-end min-h-[120px] ${stat.color}`}
            >
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">{stat.label}</p>
              <p className="text-5xl editorial-heading-bebas leading-none">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
