import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-300">
                                ن
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all duration-300">
                            نبض AI
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-cyan-400 transition-colors duration-300">المميزات</a>
                        <a href="#pricing" className="hover:text-cyan-400 transition-colors duration-300">الأسعار</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors duration-300">عن نبض</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        <Button href="/login" variant="ghost" className="hidden sm:inline-flex">
                            دخول
                        </Button>
                        <Button href="/chat" variant="glow">
                            جرب نبض مجاناً 🚀
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
