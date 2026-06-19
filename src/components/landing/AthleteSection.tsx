import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';

/**
 * Real athletes from Lakshadweep, India.
 * Sources: Wikipedia, Lakshadweep Athletics Association (lakathletics.com),
 * World Athletics, Tribune India, The Hindu, Indian Express.
 */
const athletes = [
  {
    name: "MUBASSINA MOHAMMED",
    island: "MINICOY, LAKSHADWEEP",
    born: "FEB 22, 2006",
    event: "LONG JUMP · HEPTATHLON",
    pb: "6.38M",
    pbNote: "Indian Open Jumps, Mar 2026",
    coach: "ANJU BOBBY GEORGE FOUNDATION",
    medals: [
      "🥈 Asian U18 Championships — Long Jump, Kuwait 2022",
      "🥈 Asian U18 Championships — Heptathlon, Kuwait 2022",
      "🥇 Indian Open Jumps Competition, 2026",
      "🥈 South Asian Senior Athletics Championships — Long Jump, 2025",
    ],
    bio: "First athlete from Lakshadweep to win an international medal for India. Trained on a 200m mud track before reaching the Asian podium.",
    wikiUrl: "https://en.wikipedia.org/wiki/Mubassina_Mohammed",
    // Long jump action shot — tropical venue
    image: "/mubassina.jpg",
    imageAlt: "Mubassina Mohammed",
    color: "bg-track-lagoon",
    objectPosition: "top",
  },
  {
    name: "MUNSIRA MUNEER U.K.",
    island: "LAKSHADWEEP",
    born: "c. 2007",
    event: "BALL THROW · FIELD EVENTS",
    pb: "34.5M",
    pbNote: "South Zone National Jr. Championship, 2021",
    coach: "LAKSHADWEEP ATHLETICS ASSOCIATION",
    medals: [
      "🥇 First-ever Gold Medal for Lakshadweep Athletics",
      "South Zone National Junior Championship — Ball Throw (U14), 2021",
      "🏅 4th Asian Youth Athletics Championships — Kuwait, 2022",
    ],
    bio: "Historic gold medallist who put Lakshadweep on the national athletics map. Pioneer of the island's youth field-events programme.",
    wikiUrl: "https://lakathletics.com",
    image: "/munsira muneer.png",
    imageAlt: "Munsira Muneer U.K.",
    color: "bg-track-coral",
  },
  {
    name: "NIHALA K.K.",
    island: "LAKSHADWEEP",
    born: "c. 2007",
    event: "BALL THROW · SPRINTS",
    pb: "—",
    pbNote: "South Zone National Jr. Championship, 2021",
    coach: "LAKSHADWEEP ATHLETICS ASSOCIATION",
    medals: [
      "🥈 First-ever Silver Medal for Lakshadweep Athletics",
      "South Zone National Junior Championship — Ball Throw (U14), 2021",
      "🏅 4th Asian Youth Athletics Championships — Kuwait, 2022",
    ],
    bio: "Co-pioneer of Lakshadweep's athletics revolution alongside Mubassina and Munsira. Represents the islands at junior national level.",
    wikiUrl: "https://lakathletics.com",
    image: "/nihala.png",
    imageAlt: "Nihala K.K.",
    color: "bg-track-sand",
    objectPosition: "center 20%",
  }
];

export default function AthleteSection() {
  return (
    <section id="athletes" className="py-24 relative z-10 bg-track-dark overflow-hidden">
      {/* Faint background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <span className="text-[200px] editorial-heading-bebas text-white whitespace-nowrap leading-none">
          LAKSHADWEEP
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b-8 border-track-lagoon pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-track-lagoon stroke-[3]" />
              <span className="text-track-lagoon font-black text-sm uppercase tracking-widest">
                Union Territory of Lakshadweep · India
              </span>
            </div>
            <h2 className="text-6xl md:text-9xl editorial-heading text-white leading-none">
              OUR<br /><span className="text-track-coral">ATHLETES</span>
            </h2>
          </div>
          <div className="max-w-xs border-l-8 border-track-coral pl-6">
            <p className="text-xl font-black text-white/70 uppercase leading-snug mb-4">
              Island champions competing on India's national & international stage.
            </p>
            <a
              href="https://lakathletics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-track-lagoon font-black text-xs uppercase tracking-widest hover:text-track-coral transition-colors border-b-2 border-track-lagoon hover:border-track-coral pb-1"
            >
              Lakshadweep Athletics Association
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Athlete Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Athlete Profiles list */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border-8 border-white shadow-[12px_12px_0px_#FF7A45] p-8 h-full flex flex-col justify-between"
            >
              <div className="flex flex-col gap-6">
                {athletes.map((athlete, idx) => (
                  <div key={idx} className="border-l-4 border-track-lagoon pl-4 py-1">
                    <h4 className="text-xl font-black text-track-dark leading-none uppercase mb-1 flex items-center gap-2">
                      <span>{athlete.name}</span>
                      <span className="text-xs bg-track-coral text-white px-2 py-0.5 rounded-none font-bold">
                        {athlete.pb !== "—" ? athlete.pb : "CHAMPION"}
                      </span>
                    </h4>
                    <p className="text-xs text-track-dark/50 font-black uppercase tracking-wider mb-2">
                      {athlete.island} · {athlete.event}
                    </p>
                    <p className="text-xs text-track-dark/70 font-bold leading-normal italic">
                      "{athlete.bio}"
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Unified Talent Pool card */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-track-lagoon border-8 border-track-dark p-8 shadow-[12px_12px_0px_white] h-full flex flex-col justify-center"
            >
              <h4 className="text-3xl font-black text-track-dark uppercase mb-4 tracking-tight border-b-4 border-track-dark pb-2">
                Unified Talent Pool
              </h4>
              <p className="text-base text-track-dark font-bold leading-relaxed uppercase mb-6">
                TrackEye's digital registry tracks athletes across Kavaratti, Agatti, Androth, Minicoy, and Kadmat to create a permanent historical sports archive for the region.
              </p>
              <p className="text-xs text-track-dark/70 font-bold leading-relaxed uppercase">
                By compiling season statistics, personal best history, and medal records in one database, sports authorities can accurately analyze progression patterns and nurture next-generation talent for national-level qualifiers.
              </p>
            </motion.div>
          </div>

        </div>

        {/* Source credit */}
        <p className="text-center text-white/20 text-xs font-bold uppercase tracking-widest mt-12">
          Data sourced from Wikipedia · Lakshadweep Athletics Association (lakathletics.com) · World Athletics
        </p>
      </div>
    </section>
  );
}
