'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">إعدادات النظام</h1>
                    <p className="text-slate-400 text-sm mt-1">التحكم في التكوين العام، الأمان، والتنبيهات.</p>
                </div>
                <button className="bg-cyan-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all">
                    حفظ التغييرات
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
                {[
                    { id: 'general', label: 'عام', icon: '⚙️' },
                    { id: 'security', label: 'الأمان', icon: '🔐' },
                    { id: 'monitoring', label: 'المراقبة', icon: '🚨' },
                    { id: 'ai', label: 'الذكاء الاصطناعي', icon: '🤖' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 animate-enter">

                {/* General Settings */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">اسم المنصة</label>
                                <input type="text" defaultValue="نبض SaaS" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">البريد الإلكتروني للدعم</label>
                                <input type="email" defaultValue="support@nabd.ai" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none" />
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-6">
                            <h3 className="text-white font-bold mb-4">وضع الصيانة</h3>
                            <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                <div>
                                    <div className="text-sm text-slate-200 font-bold">تفعيل وضع الصيانة</div>
                                    <div className="text-xs text-slate-500">سيتم منع المستخدمين من الدخول وعرض صفحة "تحت الصيانة".</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-white/5">
                            <div>
                                <div className="text-sm text-slate-200 font-bold">المصادقة الثنائية (2FA) الإجبارية</div>
                                <div className="text-xs text-slate-500">فرض استخدام OTP لجميع المشرفين.</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">مدة انتهاء الجلسة (بالدقائق)</label>
                            <input type="number" defaultValue="30" className="w-full md:w-1/3 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none" />
                        </div>

                        <div className="border-t border-white/5 pt-6">
                            <h3 className="text-red-400 font-bold mb-4">منطقة الخطر</h3>
                            <button className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-sm hover:bg-red-500/20 transition-colors">
                                تسجيل خروج جميع المستخدمين
                            </button>
                        </div>
                    </div>
                )}

                {/* Monitoring Settings */}
                {activeTab === 'monitoring' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Webhook URL (Discord/Slack)</label>
                            <div className="flex gap-2">
                                <input type="password" placeholder="https://discord.com/api/webhooks/..." className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none" />
                                <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm border border-white/10 hover:bg-slate-700">تجربة</button>
                            </div>
                            <p className="text-xs text-slate-500">يستخدم لإرسال التنبيهات الحرجة (Critical Alerts).</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-white font-bold text-sm">مستويات التنبيه</h3>
                            {['API Errors', 'High Latency', 'Failed Logins', 'New Subscription'].map(item => (
                                <div key={item} className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900" />
                                    <span className="text-sm text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Settings */}
                {activeTab === 'ai' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">النموذج الافتراضي (Default Model)</label>
                            <select className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none">
                                <option>Llama 3.1 70B (Recommended)</option>
                                <option>Gemma 2 9B (Fast)</option>
                                <option>Mistral Large</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">System Prompt (Global)</label>
                            <textarea rows={6} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none text-sm font-mono" defaultValue="You are Nabd, a helpful AI assistant..." />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
