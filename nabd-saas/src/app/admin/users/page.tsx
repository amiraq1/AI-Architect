'use client';

import { useState } from 'react';

// Mock Data for users
const USERS_DATA = [
    { id: 1, name: 'علي محمد', email: 'ali@example.com', role: 'Admin', plan: 'Enterprise', status: 'Active', joined: '2025-12-01' },
    { id: 2, name: 'سارة أحمد', email: 'sara@example.com', role: 'User', plan: 'Pro', status: 'Active', joined: '2026-01-10' },
    { id: 3, name: 'شركة النهرين', email: 'info@nahrain.iq', role: 'User', plan: 'Business', status: 'Active', joined: '2026-01-15' },
    { id: 4, name: 'حسين كريم', email: 'hussein@test.com', role: 'User', plan: 'Free', status: 'Inactive', joined: '2025-11-20' },
    { id: 5, name: 'مريم يوسف', email: 'maryam@design.com', role: 'Editor', plan: 'Pro', status: 'Active', joined: '2026-01-22' },
];

import { fuzzySearch } from '@/lib/arabic-utils';

export default function UsersManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = USERS_DATA.filter(user =>
        fuzzySearch(user.name, searchTerm) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">إدارة المستخدمين</h1>
                    <p className="text-slate-400 text-sm mt-1">عرض وإدارة الحسابات المسجلة في النظام.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-700 transition-colors border border-white/5">
                        تصدير (CSV)
                    </button>
                    <button className="bg-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all">
                        + إضافة مستخدم
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute right-3 top-2.5 text-slate-500">🔍</span>
                    <input
                        type="text"
                        placeholder="بحث بالاسم أو البريد..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none">
                    <option>كل الخطط</option>
                    <option>Free</option>
                    <option>Pro</option>
                    <option>Business</option>
                </select>
                <select className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none">
                    <option>الحالة: الكل</option>
                    <option>نشط</option>
                    <option>خامل</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead className="bg-slate-950/50 text-slate-400 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-medium">الاسم</th>
                            <th className="px-6 py-4 font-medium">الخطة</th>
                            <th className="px-6 py-4 font-medium">الدور</th>
                            <th className="px-6 py-4 font-medium">الحالة</th>
                            <th className="px-6 py-4 font-medium">تاريخ الانضمام</th>
                            <th className="px-6 py-4 font-medium">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{user.name}</div>
                                            <div className="text-[10px] text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-mono px-2 py-1 rounded border ${user.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        user.plan === 'Pro' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                            'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}>
                                        {user.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${user.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-500/10'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                                        {user.status === 'Active' ? 'نشط' : 'خامل'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs font-mono">{user.joined}</td>
                                <td className="px-6 py-4">
                                    <button className="text-slate-400 hover:text-white transition-colors">•••</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Mockup */}
            <div className="flex justify-between items-center text-xs text-slate-500 px-2">
                <span>عرض 1-5 من 42 مستخدم</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded bg-slate-900 border border-white/10 hover:border-white/20">السابق</button>
                    <button className="px-3 py-1 rounded bg-slate-900 border border-white/10 hover:border-white/20">التالي</button>
                </div>
            </div>

        </div>
    );
}
