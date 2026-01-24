import React from 'react';

interface Transaction {
    user: string;
    email: string;
    operation: string;
    time: string;
    status: 'Success' | 'Failed' | 'Pending';
    amount?: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    return (
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">العمليات الأخيرة</h3>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">عرض الكل</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="bg-white/5 text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium whitespace-nowrap">العميل</th>
                            <th className="px-6 py-4 font-medium whitespace-nowrap">العملية</th>
                            <th className="px-6 py-4 font-medium whitespace-nowrap">التوقيت</th>
                            <th className="px-6 py-4 font-medium whitespace-nowrap">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                        {transactions.map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 font-medium text-white group-hover:text-cyan-200 transition-colors">
                                    <div>
                                        <div className="font-bold">{row.user}</div>
                                        <div className="text-[10px] text-slate-500">{row.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span>{row.operation}</span>
                                        {row.amount && <span className="text-[10px] text-emerald-400 font-mono">{row.amount}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{row.time}</td>
                                <td className="px-6 py-4">
                                    <span className={`
                                        px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                        ${row.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            row.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'}
                                    `}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
