import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import PlatformOverview from '../components/landing/PlatformOverview';
import IslandSection from '../components/landing/IslandSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-track-foam overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PlatformOverview />
      <IslandSection />
    </div>
  );
}
