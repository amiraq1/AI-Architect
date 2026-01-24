'use client';

import { StatsCard } from '@/components/admin/StatsCard';
import { RecentTransactions } from '@/components/admin/RecentTransactions';

// ⚡ PERFORMANCE: Cache this page for 5 minutes
// ⚡ PERFORMANCE: Cache this page for 5 minutes
// export const revalidate = 300; // Removed: invalid in 'use client'

export default function AdminDashboard() {
    // Mock Data (In a real app, fetch this from API)
    const stats = [
        { title: "المستخدمين النشطين", value: "2,405", icon: "👥", color: "from-blue-500 to-cyan-500", trend: "up" as const, trendValue: "12%" },
        { title: "الرسائل اليوم", value: "85.2K", icon: "💬", color: "from-purple-500 to-pink-500", trend: "up" as const, trendValue: "5%" },
        { title: "الإيرادات", value: "$4,200", icon: "💎", color: "from-emerald-500 to-teal-500", trend: "up" as const, trendValue: "8%" },
        { title: "صحة السيرفر", value: "99.9%", icon: "⚡", color: "from-amber-500 to-orange-500", trend: "neutral" as const, trendValue: "0%" },
    ];

    const transactions = [
        { user: "مريم أحمد", email: "maryam@example.com", operation: "شراء خطة Pro", time: "منذ 2 دقيقة", status: "Success" as const, amount: "+15,000 د.ع" },
        { user: "شركة الرافدين", email: "info@rafidain.iq", operation: "تحديث API Key", time: "منذ 15 دقيقة", status: "Success" as const },
        { user: "سيف علي", email: "saif@gmail.com", operation: "فشل الدفع", time: "منذ 40 دقيقة", status: "Failed" as const, amount: "40,000 د.ع" },
        { user: "نور الهدى", email: "noor@edu.iq", operation: "تسجيل جديد", time: "منذ 1 ساعة", status: "Pending" as const },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            {/* Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Area (Spans 2 columns) */}
                <div className="lg:col-span-2 p-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 h-[400px] relative overflow-hidden group flex flex-col">
                    <div className="p-6 relative z-10 flex justify-between items-start">
                        <div>
                            <h3 className="text-slate-200 font-bold text-lg">تحليلات الأداء</h3>
                            <p className="text-xs text-slate-500">نشاط النظام خلال الـ 24 ساعة الماضية</p>
                        </div>
                        <select className="bg-slate-800 text-xs text-slate-300 border border-white/10 rounded-lg px-2 py-1 outline-none focus:border-cyan-500">
                            <option>اليوم</option>
                            <option>الأسبوع</option>
                        </select>
                    </div>

                    {/* Decorative Grid */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

                    {/* CSS Chart Representation */}
                    <div className="flex-1 flex items-end justify-between px-8 pb-8 gap-2 opacity-60">
                        {[40, 60, 45, 70, 50, 80, 60, 90, 75, 85, 65, 95, 80, 100, 90, 70, 60, 80, 50, 60].map((h, i) => (
                            <div key={i} className="w-full bg-gradient-to-t from-cyan-500/10 to-cyan-400 rounded-t-sm transition-all duration-1000 hover:opacity-100 hover:to-purple-400 origin-bottom" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* Recent Tables (Spans 1 column) */}
                <div className="lg:col-span-1 h-[400px]">
                    <RecentTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
