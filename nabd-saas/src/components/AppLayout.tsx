'use client';

import { useState } from 'react';
import { HiMenuAlt3, HiX, HiHome, HiChat, HiCog, HiLogout } from 'react-icons/hi';
import Link from 'next/link';

interface AppSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

function AppSidebar({ isOpen, setIsOpen }: AppSidebarProps) {
    const menuItems = [
        { icon: HiHome, label: 'الرئيسية', href: '/' },
        { icon: HiChat, label: 'المحادثة', href: '/chat' },
        { icon: HiCog, label: 'الإعدادات', href: '/settings' },
    ];

    return (
        <>
            {/* Overlay للموبايل */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* القائمة الجانبية */}
            <aside
                className={`
          fixed lg:static inset-y-0 right-0 z-50
          w-64 bg-slate-900 border-l border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <span className="text-xl font-bold text-cyan-400">نبض AI</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <HiX className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-xl transition-colors">
                        <HiLogout className="h-5 w-5" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        // إضافة overflow-x-hidden لمنع اهتزاز الشاشة يميناً ويساراً
        <div className="min-h-screen bg-slate-950 flex overflow-x-hidden" dir="rtl">

            {/* القائمة الجانبية (تم تحسين الـ z-index لتكون فوق كل شيء) */}
            <AppSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            {/* المحتوى الرئيسي */}
            <div className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out">

                {/* الشريط العلوي للموبايل فقط */}
                <div className="lg:hidden flex items-center justify-between bg-slate-900 px-4 py-3 shadow-sm z-30 sticky top-0 border-b border-slate-800">
                    <span className="font-bold text-lg text-cyan-400">نبض AI</span>

                    <button
                        onClick={() => setSidebarOpen(true)}
                        // تكبير منطقة اللمس للزر (p-2)
                        className="p-2 -mr-2 rounded-md text-slate-400 hover:bg-slate-800 active:bg-slate-700"
                    >
                        <HiMenuAlt3 className="h-7 w-7" />
                    </button>
                </div>

                {/* منطقة المحتوى - إضافة padding-bottom لضمان عدم اختفاء صندوق الكتابة خلف أزرار الهاتف */}
                <main className="flex-1 overflow-y-auto p-4 pb-20 sm:p-6 lg:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}
