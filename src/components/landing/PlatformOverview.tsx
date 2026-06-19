import { motion } from 'framer-motion';
import { 
  Trophy, Map, Users, CheckSquare, ListOrdered, Smartphone, 
  Camera, Timer, ShieldCheck, Activity, FileText, LineChart, 
  Database, Eye 
} from 'lucide-react';

const features = [
  {
    num: '01',
    title: 'COMPETITION SETUP',
    icon: Trophy,
    color: 'bg-track-dark text-white',
    desc: 'Create and manage the entire Lakshadweep Sports Meet digitally. Define age categories, schedule events, and organize all track and field events under a single structure.',
  },
  {
    num: '02',
    title: 'ISLAND TEAM REGISTRATION',
    icon: Map,
    color: 'bg-track-coral text-white',
    desc: 'Registration of all participating island teams. Maintain athlete rosters, submit event entries, and monitor live island-wise medal standings.',
  },
  {
    num: '03',
    title: 'ATHLETE DATABASE',
    icon: Users,
    color: 'bg-track-lagoon text-track-dark',
    desc: 'A permanent digital database storing personal information, event history, personal bests, and seasonal statistics, creating a long-term archive.',
  },
  {
    num: '04',
    title: 'ENTRY VERIFICATION',
    icon: CheckSquare,
    color: 'bg-[#FFEB3B] text-track-dark',
    desc: 'Automatically verifies entries based on age categories, island quotas, and scheduling constraints. Only compliant athletes receive approval.',
  },
  {
    num: '05',
    title: 'AUTOMATED START LISTS',
    icon: ListOrdered,
    color: 'bg-[#9C27B0] text-white',
    desc: 'Automatically generates sprint heats, lane assignments, relay arrangements, and field-event attempt orders based on approved entries.',
  },
  {
    num: '06',
    title: 'SMARTPHONE CAPTURE',
    icon: Smartphone,
    color: 'bg-[#4CAF50] text-white',
    desc: 'Transforms ordinary smartphones into competition cameras positioned at the finish line, start line, and field-event sectors.',
  },
  {
    num: '07',
    title: 'AI PHOTO-FINISH ANALYSIS',
    icon: Camera,
    color: 'bg-track-dark text-white',
    desc: 'Utilizes AI to analyze race videos frame by frame. Athletes are automatically detected and tracked to resolve close finishes.',
  },
  {
    num: '08',
    title: 'LIVE TIMING & SCORING',
    icon: Timer,
    color: 'bg-track-coral text-white',
    desc: 'Records sprint times and jump distances in real time with instant leaderboards for athletes, coaches, and spectators.',
  },
  {
    num: '09',
    title: 'REFEREE RESULT APPROVAL',
    icon: ShieldCheck,
    color: 'bg-track-lagoon text-track-dark',
    desc: 'All results undergo an official review process. Referees examine video evidence, process disqualifications, and approve final results.',
  },
  {
    num: '10',
    title: 'AUTOMATIC RECORD TRACKING',
    icon: Activity,
    color: 'bg-[#FFEB3B] text-track-dark',
    desc: 'Continuously compares performances against existing meet, age-group, and historical Lakshadweep records, generating automatic alerts.',
  },
  {
    num: '11',
    title: 'INSTANT RESULTS & REPORTING',
    icon: FileText,
    color: 'bg-[#9C27B0] text-white',
    desc: 'Automatically generates official result sheets, medal summaries, and team standings, exportable in PDF and Excel formats.',
  },
  {
    num: '12',
    title: 'PERFORMANCE ANALYTICS',
    icon: LineChart,
    color: 'bg-[#4CAF50] text-white',
    desc: 'Long-term performance analysis to help sports authorities identify emerging talent and monitor athlete development.',
  },
  {
    num: '13',
    title: 'HISTORICAL ARCHIVE',
    icon: Database,
    color: 'bg-track-dark text-white',
    desc: 'All competition data, videos, and results are securely preserved, establishing a comprehensive digital athletics archive for Lakshadweep.',
  },
  {
    num: '14',
    title: 'TRANSPARENCY & ACCESSIBILITY',
    icon: Eye,
    color: 'bg-track-coral text-white',
    desc: 'Integrates competition management, AI officiating, and analytics into a single accessible platform, enhancing professionalism.',
  },
];

export default function PlatformOverview() {
  return (
    <section id="features" className="py-20 bg-track-foam border-t-8 border-track-dark">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-6">
          <div className="flex items-start gap-6">
            {/* Vertical label */}
            <div className="hidden md:flex flex-col items-center gap-3 pt-1">
              <div className="w-1 h-16 bg-track-coral" />
              <span
                className="text-xs font-black text-track-dark/40 uppercase tracking-[0.35em] whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                PLATFORM ARSENAL
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-track-dark/40 uppercase tracking-[0.35em] mb-3 md:hidden">PLATFORM ARSENAL</div>
              <h2 className="text-6xl md:text-8xl editorial-heading text-track-dark leading-none">
                WHAT WE<br /><span className="text-track-coral">DELIVER</span>
              </h2>
            </div>
          </div>
          <p className="max-w-sm text-lg font-bold text-track-dark/60 uppercase leading-snug border-l-8 border-track-coral pl-4 self-end">
            Everything you need to manage world-class athletics competitions.
          </p>
        </div>

        {/* 2×3 numbered grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t-4 border-l-4 border-track-dark">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className="border-b-4 border-r-4 border-track-dark p-8 bg-white hover:bg-track-foam transition-colors group will-change-transform relative overflow-hidden"
            >
              {/* Large number watermark */}
              <div className="absolute -right-4 -top-6 text-[100px] font-black text-track-dark opacity-[0.04] leading-none select-none pointer-events-none editorial-heading-bebas">
                {feature.num}
              </div>

              {/* Number + icon row */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl editorial-heading-bebas text-track-dark/20 leading-none">{feature.num}</span>
                <div className={`w-14 h-14 flex items-center justify-center border-4 border-track-dark transform -skew-x-6 shadow-[4px_4px_0px_#010F1A] ${feature.color}`}>
                  <feature.icon className="w-7 h-7 stroke-[2.5]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black uppercase tracking-tight text-track-dark mb-3 group-hover:text-track-coral transition-colors leading-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-track-dark/60 font-bold text-sm leading-relaxed uppercase">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
