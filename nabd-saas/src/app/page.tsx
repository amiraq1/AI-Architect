import dynamic from 'next/dynamic';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';

// ⚡ Dynamic Imports for Performance (Lazy Loading)
const FeaturesGrid = dynamic(() => import('@/components/landing/FeaturesGrid').then(mod => mod.FeaturesGrid), {
  loading: () => <div className="max-w-7xl mx-auto h-[600px] bg-slate-900/20 rounded-3xl animate-pulse my-20" />
});

const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => mod.Footer));

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
