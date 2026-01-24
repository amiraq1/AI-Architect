'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function UserDetailsPage() {
    const params = useParams();
    const userId = params.id;

    // Mock User Data
    const user = {
        name: 'علي محمد',
        email: 'ali@example.com',
        role: 'Admin',
        plan: 'Enterprise',
        company: 'شركة بابل التقنية',
        phone: '+964 780 123 4567',
        status: 'Active',
        joined: '2025-12-01',
        lastLogin: 'منذ ساعتين',
        usage: {
            tokens: '1.2M',
            chats: 450,
            spend: '$120'
        }
    };

    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Link href="/admin/users" className="hover:text-cyan-400">المستخدمين</Link>
                <span>/</span>
                <span className="text-slate-300 font-bold">{user.name}</span>
            </div>

            {/* Profile Header Card */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-l from-cyan-900/20 to-purple-900/20"></div>

                <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-cyan-500/20 ring-4 ring-slate-900">
                        {user.name[0]}
                    </div>

                    <div className="flex-1 mb-2">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {user.name}
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {user.status}
                            </span>
                        </h1>
                        <p className="text-slate-400 flex items-center gap-4 mt-1">
                            <span>📧 {user.email}</span>
                            <span>🏢 {user.company}</span>
                            <span>📱 {user.phone}</span>
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold border border-white/10 transition-colors">
                            إعادة تعيين كلمة المرور
                        </button>
                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-bold border border-red-500/20 transition-colors">
                            حظر المستخدم
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-xl">🤖</div>
                    <div>
                        <div className="text-slate-500 text-xs">استهلاك الرموز</div>
                        <div className="text-white font-bold text-xl">{user.usage.tokens}</div>
                    </div>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xl">💬</div>
                    <div>
                        <div className="text-slate-500 text-xs">إجمالي المحادثات</div>
                        <div className="text-white font-bold text-xl">{user.usage.chats}</div>
                    </div>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xl">💰</div>
                    <div>
                        <div className="text-slate-500 text-xs">المصروفات</div>
                        <div className="text-white font-bold text-xl">{user.usage.spend}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10 flex gap-6">
                {['overview', 'security', 'billing', 'audit'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {tab === 'overview' && 'نظرة عامة'}
                        {tab === 'security' && 'الأمان والصلاحيات'}
                        {tab === 'billing' && 'الاشتراكات'}
                        {tab === 'audit' && 'سجل النشاط'}

                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content (Mockup for Overview) */}
            <div className="bg-slate-900/20 rounded-2xl p-6 border border-white/5 min-h-[300px]">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h3 className="text-white font-bold">تفاصيل الحساب</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'User ID', val: userId },
                                { label: 'Role', val: user.role },
                                { label: 'Plan', val: user.plan },
                                { label: 'Joined Date', val: user.joined },
                                { label: 'Last Login', val: user.lastLogin },
                                { label: 'Language', val: 'Arabic (IQ)' },
                            ].map((field, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-xs text-slate-500 uppercase">{field.label}</span>
                                    <span className="text-slate-200 font-mono text-sm bg-slate-950/50 px-3 py-2 rounded-lg border border-white/5">
                                        {field.val}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="text-center py-10 text-slate-500">
                        <div className="text-4xl mb-4">🔐</div>
                        <p>إعدادات الأمان وقائمة جلسات الدخول ستظهر هنا.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
