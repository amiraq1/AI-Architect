'use client';

import { useState } from 'react';
import { fuzzySearch } from '@/lib/arabic-utils';

// --- Types & Mock Data ---
interface User {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'User' | 'Editor';
    plan: 'Enterprise' | 'Pro' | 'Business' | 'Free';
    status: 'Active' | 'Inactive';
    joined: string;
    lastActive: string;
}

const USERS_DATA: User[] = [
    { id: 1, name: 'علي محمد', email: 'ali@example.com', role: 'Admin', plan: 'Enterprise', status: 'Active', joined: '2025-12-01', lastActive: 'الآن' },
    { id: 2, name: 'سارة أحمد', email: 'sara@example.com', role: 'User', plan: 'Pro', status: 'Active', joined: '2026-01-10', lastActive: 'منذ 5د' },
    { id: 3, name: 'شركة النهرين', email: 'info@nahrain.iq', role: 'User', plan: 'Business', status: 'Active', joined: '2026-01-15', lastActive: 'منذ يوم' },
    { id: 4, name: 'حسين كريم', email: 'hussein@test.com', role: 'User', plan: 'Free', status: 'Inactive', joined: '2025-11-20', lastActive: 'منذ شهر' },
    { id: 5, name: 'مريم يوسف', email: 'maryam@design.com', role: 'Editor', plan: 'Pro', status: 'Active', joined: '2026-01-22', lastActive: 'منذ 2س' },
];

export default function UsersManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');

    // Derived state
    const filteredUsers = USERS_DATA.filter(user => {
        const matchesSearch = fuzzySearch(user.name, searchTerm) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="min-h-screen space-y-8 relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none -z-10" />
            <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Header Section: Asymmetrical & Bold */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight">
                        النخبة الرقمية
                    </h1>
                    <p className="text-slate-400 font-light text-sm max-w-md leading-relaxed">
                        لوحة التحكم المركزية لإدارة هويات المستخدمين وصلاحيات الوصول. راقب، عدّل، وتحكم بدقة متناهية.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <ActionButton variant="secondary">تصدير البيانات</ActionButton>
                    <ActionButton variant="primary" icon="+">عضو جديد</ActionButton>
                </div>
            </header>

            {/* Control Bar: Floating & Acrylic */}
            <div className="sticky top-4 z-20 backdrop-blur-xl bg-slate-950/70 border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 flex flex-col md:flex-row gap-3 items-center justify-between transition-all duration-300 hover:border-white/20">
                {/* Search Input */}
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="ابحث عن مستخدم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-transparent rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:bg-slate-900 focus:border-cyan-500/30 transition-all font-medium"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                    {['all', 'Admin', 'User', 'Editor'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 relative overflow-hidden group ${selectedRole === role
                                    ? 'bg-white text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]'
                                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <span className="relative z-10">{role === 'all' ? 'الكل' : role}</span>
                            {selectedRole === role && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Grid: Minimalist & Immersive */}
            <div className="grid grid-cols-1 gap-4">
                {filteredUsers.map((user, idx) => (
                    <UserRowCard key={user.id} user={user} index={idx} />
                ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <p className="text-slate-500 font-mono text-sm">لا توجد نتائج مطابقة</p>
                </div>
            )}
        </div>
    );
}

// --- Sub-Components (Intentional Minimalism) ---

function ActionButton({ children, variant, icon }: { children: React.ReactNode, variant: 'primary' | 'secondary', icon?: string }) {
    const base = "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 relative overflow-hidden group";
    const styles = variant === 'primary'
        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/40 hover:bg-cyan-500"
        : "bg-slate-800/50 text-slate-300 border border-white/5 hover:bg-slate-800 hover:border-white/20";

    return (
        <button className={`${base} ${styles}`}>
            {icon && <span className="text-lg leading-none">{icon}</span>}
            <span className="relative z-10">{children}</span>
            {variant === 'primary' && <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />}
        </button>
    );
}

function UserRowCard({ user, index }: { user: User, index: number }) {
    // Staggered animation delay based on index
    return (
        <div
            className="group relative bg-slate-900/20 backdrop-blur-sm border border-white/5 hover:border-cyan-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Identity */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Avatar name={user.name} />
                <div>
                    <h3 className="text-white font-bold group-hover:text-cyan-400 transition-colors">{user.name}</h3>
                    <p className="text-slate-500 text-xs font-mono">{user.email}</p>
                </div>
            </div>

            {/* Meta Data Grid */}
            <div className="flex items-center gap-2 md:gap-8 w-full md:w-auto justify-between md:justify-end text-sm">

                <Badge label={user.role} type="neutral" />

                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Plan</span>
                    <span className={`font-bold ${user.plan === 'Enterprise' ? 'text-purple-400 shadow-purple-500/50 drop-shadow-sm' : 'text-slate-300'}`}>{user.plan}</span>
                </div>

                <div className="flex flex-col items-end min-w-[60px]">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Status</span>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500'}`} />
                        <span className={user.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}>{user.status === 'Active' ? 'نشط' : 'خامل'}</span>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-end min-w-[80px]">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Active</span>
                    <span className="text-slate-400 font-mono text-xs">{user.lastActive}</span>
                </div>
            </div>

            {/* Actions overlay (only distinct on hover) */}
            <button className="absolute right-4 top-4 md:static md:opacity-0 md:group-hover:opacity-100 p-2 text-slate-400 hover:text-white transition-all bg-slate-800/50 rounded-lg hover:bg-cyan-600/80">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
        </div>
    );
}

function Avatar({ name }: { name: string }) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
    // Deterministic gradient based on name length
    const gradients = [
        'from-pink-500 to-rose-500',
        'from-cyan-500 to-blue-500',
        'from-violet-500 to-purple-500',
        'from-amber-500 to-orange-500'
    ];
    const gradient = gradients[name.length % gradients.length];

    return (
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-xs shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {initials}
        </div>
    );
}

function Badge({ label, type }: { label: string, type: 'neutral' | 'accent' }) {
    return (
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300 font-mono">
            {label}
        </span>
    );
}
