'use client';

import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden" dir="rtl">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-slate-900/50 backdrop-blur-xl border-l border-white/5 flex flex-col z-20 transition-all duration-300">
                <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
                            ⚡
                        </div>
                        <span className="font-bold text-lg hidden lg:block text-slate-200">نبض Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 py-4 space-y-1 px-2">
                    {[
                        { name: 'نظرة عامة', icon: '📊', active: true },
                        { name: 'المستخدمين', icon: '👥', active: false },
                        { name: 'المحادثات', icon: '💬', active: false },
                        { name: 'الاشتراكات', icon: '💳', active: false },
                        { name: 'الإعدادات', icon: '⚙️', active: false },
                    ].map((item, idx) => (
                        <a
                            key={idx}
                            href="#"
                            className={`
                 flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                 ${item.active
                                    ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                }
               `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="hidden lg:block font-medium text-sm">{item.name}</span>
                        </a>
                    ))}
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 border-b border-white/5 bg-slate-900/20 backdrop-blur-sm flex items-center justify-between px-8 z-10">
                    <h2 className="text-lg font-bold text-slate-300">لوحة القيادة</h2>
                    <div className="flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                        <span className="text-xs text-emerald-500 font-mono tracking-wider">SYSTEM ONLINE</span>
                    </div>
                </header>

                {/* Content Scroll */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { title: "المستخدمين النشطين", val: "2,405", icon: "👥", color: "from-blue-500 to-cyan-500" },
                            { title: "الرسائل اليوم", val: "85.2K", icon: "💬", color: "from-purple-500 to-pink-500" },
                            { title: "الإيرادات", val: "$4,200", icon: "💎", color: "from-emerald-500 to-teal-500" },
                            { title: "صحة السيرفر", val: "99.9%", icon: "⚡", color: "from-amber-500 to-orange-500" },
                        ].map((stat, i) => (
                            <div key={i} className="group relative p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-2xl group-hover:opacity-[0.08] transition-opacity`} />
                                <div className="flex justify-between items-start mb-4 relative">
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                                        <h3 className="text-3xl font-black text-white">{stat.val}</h3>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg shadow-lg opacity-80`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${stat.color} w-[70%]`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Big Chart Area (Mockup) */}
                    <div className="mb-8 p-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 h-80 relative overflow-hidden group">
                        <div className="absolute top-6 right-6 z-10">
                            <h3 className="text-slate-300 font-bold">تحليلات الأداء</h3>
                            <p className="text-xs text-slate-500">آخر 24 ساعة</p>
                        </div>

                        {/* Decorative Grid */}
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

                        {/* Mockup Line Chart using CSS */}
                        <div className="absolute inset-x-0 bottom-0 top-20 flex items-end justify-between px-8 pb-8 gap-2 opacity-50">
                            {[40, 60, 45, 70, 50, 80, 60, 90, 75, 85, 65, 95, 80, 100, 90].map((h, i) => (
                                <div key={i} className="w-full bg-gradient-to-t from-cyan-500/20 to-cyan-500/80 rounded-t-sm transition-all duration-1000 group-hover:scale-y-110 origin-bottom" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Table */}
                    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="font-bold text-white">العمليات الأخيرة</h3>
                        </div>
                        <table className="w-full text-sm text-right">
                            <thead className="bg-white/5 text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">العميل</th>
                                    <th className="px-6 py-4 font-medium">العملية</th>
                                    <th className="px-6 py-4 font-medium">التوقيت</th>
                                    <th className="px-6 py-4 font-medium">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-300">
                                {[
                                    { u: "مريم أحمد", op: "شراء خطة Pro", t: "منذ 2 دقيقة", s: "Success" },
                                    { u: "شركة الرافدين", op: "تحديث API Key", t: "منذ 15 دقيقة", s: "Success" },
                                    { u: "سيف علي", op: "فشل الدفع", t: "منذ 40 دقيقة", s: "Failed" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{row.u}</td>
                                        <td className="px-6 py-4">{row.op}</td>
                                        <td className="px-6 py-4 text-slate-500">{row.t}</td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                 ${row.s === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}
                              `}>
                                                {row.s}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
}
