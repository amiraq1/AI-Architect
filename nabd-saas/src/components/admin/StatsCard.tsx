import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: string;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export function StatsCard({ title, value, icon, color, trend, trendValue }: StatsCardProps) {
    return (
        <div className="group relative p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.03] rounded-2xl group-hover:opacity-[0.08] transition-opacity`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-white">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2 text-xs font-bold">
                            <span className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}>
                                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
                            </span>
                            <span className="text-slate-600">مقارنة بالشهر الماضي</span>
                        </div>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg shadow-lg opacity-80`}>
                    {icon}
                </div>
            </div>

            {/* Progress Bar (Decorative) */}
            <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden relative z-10">
                <div className={`h-full bg-gradient-to-r ${color} w-[70%] group-hover:w-[85%] transition-all duration-1000`} />
            </div>
        </div>
    );
}
