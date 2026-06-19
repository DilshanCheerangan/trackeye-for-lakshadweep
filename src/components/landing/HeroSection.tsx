import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ATHLETE_IMAGE = '/athletes_collage.jpg';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-track-foam overflow-hidden pt-16 flex items-center">

      {/* ══════════════════════════════════════════════
          ATHLETE COLLAGE SHOWCASE — positioned on the right
      ══════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {/* Right color block */}
        <div
          className="absolute bg-track-lagoon/10 z-[1] border-l-8 border-track-dark hidden lg:block"
          style={{ top: '0', right: '0', width: '45%', bottom: '0' }}
        />

        {/* Floating background design card */}
        <div
          className="absolute bg-track-coral z-[1] transform rotate-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hidden lg:block"
          style={{ top: '25%', right: '12%', width: '300px', height: '350px' }}
        />

        {/* Athlete collage image */}
        <motion.img
          src={ATHLETE_IMAGE}
          alt="Lakshadweep Athlete Champions — TrackEye AI Athletics"
          className="absolute right-0 bottom-0 top-24 w-full lg:w-[45%] object-contain z-[2] p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
        />

        {/* LEFT background color for text readability on small/mobile screens */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[55%] z-[0] bg-track-foam" />
      </div>

      {/* ══════════════════════════════════════════════
          TEXT CONTENT — floats over image on the left
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-14 py-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="will-change-transform w-full lg:w-[52%]"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-5 bg-white border-2 border-track-dark px-3 py-1.5 shadow-[2px_2px_0px_#010F1A] transform -skew-x-3">
            <img src="/lak_athletics_logo.png" alt="LAK Logo" className="w-6 h-6 object-contain" />
            <div className="w-[2px] h-4 bg-track-dark/20" />
            <span className="text-[10px] sm:text-xs font-black text-track-dark uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              LAKSHADWEEP ATHLETICS ASSOCIATION
            </span>
          </div>

          {/* Main headline */}
          <h1 className="editorial-heading leading-[0.82] mb-5">
            <span className="block text-[72px] md:text-[90px] lg:text-[108px] text-track-dark drop-shadow-sm">TRACKEYE</span>
            <span className="block text-[72px] md:text-[90px] lg:text-[108px] text-track-coral drop-shadow-sm">AI ATHLETICS</span>
            <span className="block text-[72px] md:text-[90px] lg:text-[108px] text-track-dark drop-shadow-sm">COMMAND CENTER</span>
          </h1>

          {/* Subtitle */}
          <p className="text-track-dark/85 font-bold text-base leading-snug mb-2 max-w-lg">
            Everything You Need To Manage World-Class Athletics Competitions.
          </p>
          <p className="text-track-dark/55 font-bold text-sm leading-relaxed mb-8 max-w-md">
            From photo finish analysis and automatic timing to athlete performance landscapes and competition management.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard?demo=false"
              className="brutal-button bg-track-coral text-white px-6 py-3 text-sm uppercase tracking-widest font-black flex items-center gap-3 group shadow-[5px_5px_0px_#010F1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              LAUNCH PLATFORM
              <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
          HUD OVERLAYS — float on top of everything
      ══════════════════════════════════════════════ */}

      {/* PRECISION / PERFORMANCE / INTELLIGENCE — top right */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="absolute top-20 right-6 z-20 bg-track-dark/90 border-l-4 border-track-coral px-5 py-4"
      >
        <p className="text-track-coral  font-black text-xs uppercase tracking-[0.22em] leading-loose">PRECISION.</p>
        <p className="text-white        font-black text-xs uppercase tracking-[0.22em] leading-loose">PERFORMANCE.</p>
        <p className="text-track-lagoon font-black text-xs uppercase tracking-[0.22em] leading-loose">INTELLIGENCE.</p>
      </motion.div>

      {/* Speed tag */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute z-20 bg-track-lagoon text-track-dark font-black px-4 py-2 text-sm uppercase border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] transform -skew-x-6"
        style={{ bottom: '28%', right: '38%' }}
      >
        SPEED: 44.2 KM/H
      </motion.div>

      {/* Finish time card — bottom right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="absolute bottom-6 right-5 z-20 bg-track-dark border-4 border-track-lagoon p-4 shadow-[6px_6px_0px_#00C8C8]"
      >
        <p className="text-track-lagoon font-black text-[10px] uppercase tracking-[0.3em] mb-1">TO THE WORLD</p>
        <p className="text-white font-black text-3xl editorial-heading-bebas leading-none">
          9.862<span className="text-xl text-track-lagoon">s</span>
        </p>
      </motion.div>
    </div>
  );
}
