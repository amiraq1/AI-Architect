import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden" dir="rtl">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <Footer />
    </div>
  );
}
