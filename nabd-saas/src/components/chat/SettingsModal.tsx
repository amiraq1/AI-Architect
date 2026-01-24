'use client';
import { useState, useEffect } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/settings';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: UserSettings;
    onSave: (newSettings: UserSettings) => void;
}

export function SettingsModal({ isOpen, onClose, currentSettings, onSave }: SettingsModalProps) {
    const [settings, setSettings] = useState<UserSettings>(currentSettings);
    const [activeTab, setActiveTab] = useState<'general' | 'chat' | 'privacy'>('general');

    // Sync state when prop changes or modal opens
    useEffect(() => {
        setSettings(currentSettings);
    }, [currentSettings, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(settings);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" dir="rtl">
            <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] relative">

                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-slate-950/50 border-l border-white/5 p-4 flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-white mb-6 px-2">الإعدادات</h2>

                    {[
                        { id: 'general', label: '⚙️ عام' },
                        { id: 'chat', label: '💬 المحادثة' },
                        { id: 'privacy', label: '🛡️ الخصوصية' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`p-3 rounded-xl text-right transition-colors font-medium ${activeTab === tab.id
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <main className="flex-1 p-8 overflow-y-auto pb-24">
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-enter">
                            <h3 className="text-lg font-bold text-white mb-4">الإعدادات العامة</h3>

                            <div className="space-y-2">
                                <label className="block text-sm text-slate-400 mb-1">المظهر (Theme)</label>
                                <select
                                    value={settings.general.theme}
                                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, theme: e.target.value as any } })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none appearance-none"
                                >
                                    <option value="system">ملائم للنظام</option>
                                    <option value="dark">داكن (مفضل)</option>
                                    <option value="light">فاتح</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                <div>
                                    <div className="font-bold text-white text-sm">الإشعارات</div>
                                    <div className="text-xs text-slate-500">تلقي تنبيهات عند انتهاء الرد</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.general.notifications}
                                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, notifications: e.target.checked } })}
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="space-y-6 animate-enter">
                            <h3 className="text-lg font-bold text-white mb-4">تفضيلات المحادثة</h3>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                <div>
                                    <div className="font-bold text-white text-sm">الإرسال بمفتاح Enter</div>
                                    <div className="text-xs text-slate-500">استخدم Shift+Enter للسطر الجديد</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.chat.sendOnEnter}
                                        onChange={(e) => setSettings({ ...settings, chat: { ...settings.chat, sendOnEnter: e.target.checked } })}
                                    />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-slate-400 mb-1">سرعة الكتابة (Streaming Speed)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSettings({ ...settings, chat: { ...settings.chat, streamSpeed: 'normal' } })}
                                        className={`p-3 rounded-xl text-sm font-bold border transition-all ${settings.chat.streamSpeed === 'normal'
                                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50'
                                                : 'bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700'
                                            }`}
                                    >
                                        طبيعية
                                    </button>
                                    <button
                                        onClick={() => setSettings({ ...settings, chat: { ...settings.chat, streamSpeed: 'fast' } })}
                                        className={`p-3 rounded-xl text-sm font-bold border transition-all ${settings.chat.streamSpeed === 'fast'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/50'
                                                : 'bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700'
                                            }`}
                                    >
                                        ⚡ سريعة جداً
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="space-y-6 animate-enter">
                            <h3 className="text-lg font-bold text-white mb-4">الخصوصية والبيانات</h3>
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                <div>
                                    <div className="font-bold text-white text-sm">السماح بتدريب النموذج</div>
                                    <div className="text-xs text-slate-500">المساهمة في تحسين جودة "نبض" باستخدام بيانات مجهولة</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.privacy.allowTraining}
                                        onChange={(e) => setSettings({ ...settings, privacy: { ...settings.privacy, allowTraining: e.target.checked } })}
                                    />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mt-6">
                                <h4 className="text-red-400 font-bold text-sm mb-2">حذف البيانات</h4>
                                <p className="text-xs text-slate-400 mb-4">هذا الإجراء سيقوم بحذف جميع محادثاتك وسجلاتك بشكل دائم.</p>
                                <button className="text-red-400 hover:text-white hover:bg-red-500 bg-red-500/10 px-4 py-2 rounded-lg text-sm transition-all border border-red-500/20">
                                    حذف سجل المحادثات
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer Action Bar */}
                <div className="absolute bottom-0 left-0 w-full md:left-auto md:w-[calc(100%-16rem)] p-4 flex gap-3 border-t border-white/5 bg-slate-900/90 backdrop-blur-md">
                    <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                        حفظ التغييرات
                    </button>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white px-6 py-2.5 rounded-xl transition-colors hover:bg-white/5"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}
