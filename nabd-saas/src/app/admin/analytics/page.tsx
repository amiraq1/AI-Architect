// export const revalidate = 3600; // Cache analytics for 1 hour

import { StatsCard } from '@/components/admin/StatsCard';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">التحليلات المتقدمة</h1>
                    <p className="text-slate-400 text-sm mt-1">مراقبة أداء النظام، استهلاك الذكاء الاصطناعي، ونمو المستخدمين.</p>
                </div>
                <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-white/10">
                    {['24ساعة', '7أيام', '30يوم', 'سنة'].map((period, i) => (
                        <button
                            key={i}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${i === 1 ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="استهلاك الرموز (Tokens)"
                    value="12.5M"
                    icon="🤖"
                    color="from-purple-500 to-indigo-500"
                    trend="up"
                    trendValue="15%"
                />
                <StatsCard
                    title="معدل الاستجابة"
                    value="1.2s"
                    icon="⚡"
                    color="from-amber-500 to-orange-500"
                    trend="down"
                    trendValue="0.3s"
                />
                <StatsCard
                    title="تكلفة التشغيل"
                    value="$142"
                    icon="💵"
                    color="from-red-500 to-pink-500"
                    trend="up"
                    trendValue="5%"
                />
                <StatsCard
                    title="نسبة الخطأ"
                    value="0.05%"
                    icon="🎯"
                    color="from-emerald-500 to-teal-500"
                    trend="neutral"
                    trendValue="0%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Visual Chart: Token Usage History */}
                <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-80 flex flex-col">
                    <h3 className="text-white font-bold mb-6">نمو استهلاك الرموز</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 relative">
                        {/* Background Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
                        </div>

                        {/* Bars */}
                        {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 100].map((h, i) => (
                            <div key={i} className="w-full flex flex-col justify-end group cursor-pointer">
                                <div
                                    className="w-full bg-gradient-to-t from-purple-500/20 to-purple-500 rounded-t-sm transition-all duration-300 group-hover:opacity-100 opacity-70 group-hover:scale-y-105 origin-bottom"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-800 text-white text-xs px-2 py-1 rounded border border-white/10 transition-opacity">
                                    {h * 1000} T
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-500">
                        <span>1 Jan</span>
                        <span>15 Jan</span>
                        <span>30 Jan</span>
                    </div>
                </div>

                {/* Visual Chart: Model Preference (Pie Chart) */}
                <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-80 flex flex-col relative overflow-hidden">
                    <h3 className="text-white font-bold mb-6">تفضيلات النماذج</h3>
                    <div className="flex items-center justify-center flex-1 gap-8">
                        {/* Conic Gradient for Pie Chart */}
                        <div className="w-48 h-48 rounded-full relative"
                            style={{ background: 'conic-gradient(#06b6d4 0% 45%, #8b5cf6 45% 75%, #10b981 75% 100%)' }}>
                            <div className="absolute inset-4 bg-slate-950 rounded-full flex items-center justify-center">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-white">4.2M</span>
                                    <span className="text-xs text-slate-500">محادثة</span>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-4">
                            {[
                                { label: 'Llama 3 (70B)', val: '45%', color: 'bg-cyan-500' },
                                { label: 'Gemma 2 (9B)', val: '30%', color: 'bg-indigo-500' },
                                { label: 'Mistral Large', val: '25%', color: 'bg-emerald-500' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`}></div>
                                    <div>
                                        <div className="text-sm text-slate-300 font-medium">{item.label}</div>
                                        <div className="text-xs text-slate-500">{item.val} Usage</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Server Health Map Mockup */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold">التوزيع الجغرافي للطلبات</h3>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 animate-pulse">Live</span>
                </div>

                <div className="h-64 bg-[#0f172a] rounded-xl border border-white/5 relative opacity-80 overflow-hidden">
                    {/* Abstract Map Dots */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#1e293b_0%,_transparent_70%)]"></div>

                    <div className="absolute top-[40%] left-[55%] w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_#06b6d4] animate-ping"></div>
                    <div className="absolute top-[40%] left-[55%] w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <div className="absolute top-[40%] left-[55%] mt-4 ml-[-20px] text-xs text-cyan-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">Baghdad (HQ)</div>

                    <div className="absolute top-[35%] left-[50%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7] opacity-60"></div>
                    <div className="absolute top-[45%] left-[60%] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7] opacity-60"></div>
                </div>
            </div>

        </div>
    );
}
