import { Globe, MessageCircle, Video, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-track-dark relative overflow-hidden pt-20 pb-8 z-10 border-t-8 border-track-coral">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white border-4 border-white flex items-center justify-center overflow-hidden transform -skew-x-12">
                <img src="/lak_athletics_logo_old.png" alt="LAK Athletics Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-4xl editorial-heading-bebas text-white tracking-widest">
                TRACKEYE
              </span>
            </div>
            <p className="text-white/80 font-bold uppercase max-w-sm leading-relaxed mb-8 border-l-4 border-track-coral pl-4">
              The world's most advanced AI-powered athletics competition management platform. Engineered for precision, speed, and elite performance.
            </p>
            <div className="flex gap-4">
              {[Globe, MessageCircle, Video, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white border-4 border-track-coral flex items-center justify-center text-track-dark hover:bg-track-coral hover:text-white transition-colors transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_white]">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-xl mb-6 text-track-lagoon uppercase tracking-widest">PLATFORM</h4>
            <ul className="space-y-4 font-bold text-white uppercase">
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-lagoon hover:before:bg-track-coral">Competition Management</a></li>
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-lagoon hover:before:bg-track-coral">Live Camera Analysis</a></li>
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-lagoon hover:before:bg-track-coral">Athlete Analytics</a></li>
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-lagoon hover:before:bg-track-coral">Hardware Integration</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-xl mb-6 text-track-sand uppercase tracking-widest">COMPANY</h4>
            <ul className="space-y-4 font-bold text-white uppercase">
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-sand hover:before:bg-track-coral">About Us</a></li>
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-sand hover:before:bg-track-coral">Case Studies</a></li>
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-sand hover:before:bg-track-coral">Support</a></li>
              <li><a href="#" className="hover:text-track-coral transition-colors flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-track-sand hover:before:bg-track-coral">Contact Sales</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-4 border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between text-white/50 font-bold uppercase text-sm">
          <p>&copy; {new Date().getFullYear()} TRACKEYE ATHLETICS INTELLIGENCE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
