'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HiMenu, HiX } from 'react-icons/hi';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-300">
                                ن
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all duration-300">
                            نبض AI
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-cyan-400 transition-colors duration-300">المميزات</a>
                        <a href="#pricing" className="hover:text-cyan-400 transition-colors duration-300">الأسعار</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors duration-300">عن نبض</a>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-5">
                        <Button href="/login" variant="ghost" className="text-base">
                            دخول
                        </Button>
                        <Button href="/chat" variant="neon" size="sm" className="px-6">
                            جرب نبض مجاناً 🚀
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-950 border-b border-white/5 animate-fade-in-up">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5">المميزات</a>
                        <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5">الأسعار</a>
                        <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5">عن نبض</a>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button href="/chat" variant="neon" className="w-full justify-center">
                                جرب نبض مجاناً 🚀
                            </Button>
                            <Button href="/login" variant="secondary" className="w-full justify-center">
                                تسجيل الدخول
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
