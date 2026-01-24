'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: 'نظرة عامة', icon: '📊', href: '/admin', exact: true },
        { name: 'المستخدمين', icon: '👥', href: '/admin/users' },
        { name: 'التحليلات', icon: '📈', href: '/admin/analytics' },
        { name: 'المحادثات', icon: '💬', href: '/admin/chats' },
        { name: 'الاشتراكات', icon: '💳', href: '/admin/billing' },
        { name: 'الإعدادات', icon: '⚙️', href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden" dir="rtl">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-slate-900/50 backdrop-blur-xl border-l border-white/5 flex flex-col z-20 transition-all duration-300 relative">
                <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
                            ⚡
                        </div>
                        <span className="font-bold text-lg hidden lg:block text-slate-200">نبض Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 py-4 space-y-1 px-2">
                    {navItems.map((item, idx) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive
                                        ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                    }
                `}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="hidden lg:block font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-white/10">👤</div>
                        <div className="hidden lg:block overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">علي (Admin)</p>
                            <p className="text-[10px] text-slate-500 truncate">ali@nabd.ai</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col relative overflow-hidden z-10">
                {/* Top Bar */}
                <header className="h-16 border-b border-white/5 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between px-8 z-10">
                    <h2 className="text-lg font-bold text-slate-300">
                        {navItems.find(i => pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href)))?.name || 'لوحة القيادة'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                        <span className="text-xs text-emerald-500 font-mono tracking-wider">SYSTEM ONLINE</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
