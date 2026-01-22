import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAdminStats } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';

export default function AdminPage() {
    const { data: user } = useAuth();
    const { data: stats, isLoading, error } = useQuery(getAdminStats);

    // التحقق من صلاحية الأدمن
    if (!user?.isAdmin) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-400 mb-2">⛔ غير مصرح</h1>
                    <p className="text-slate-400">ليس لديك صلاحية الوصول لهذه الصفحة</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-cyan-400 animate-pulse">جاري التحميل...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-red-400">خطأ: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8" dir="rtl">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-cyan-400 mb-2">🎛️ لوحة التحكم</h1>
                    <p className="text-slate-400">مرحباً {user.username}، هذه إحصائيات النظام</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">👥</span>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">المستخدمين</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.totalUsers || 0}</div>
                        <div className="text-sm text-slate-400">إجمالي المستخدمين</div>
                    </div>

                    {/* Total Chats */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">💬</span>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">المحادثات</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.totalChats || 0}</div>
                        <div className="text-sm text-slate-400">إجمالي المحادثات</div>
                    </div>

                    {/* Total Messages */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">📨</span>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">الرسائل</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.totalMessages || 0}</div>
                        <div className="text-sm text-slate-400">إجمالي الرسائل</div>
                    </div>

                    {/* Premium Users */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">⭐</span>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Premium</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{stats?.premiumUsers || 0}</div>
                        <div className="text-sm text-slate-400">المشتركين المميزين</div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">📊 النشاط الأخير</h2>
                    <div className="space-y-3">
                        {stats?.recentActivity?.map((activity: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                                        {activity.type === 'message' ? '💬' : '👤'}
                                    </div>
                                    <div>
                                        <div className="text-sm text-white">{activity.description}</div>
                                        <div className="text-xs text-slate-500">{activity.user}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500">{activity.time}</div>
                            </div>
                        )) || (
                                <div className="text-center text-slate-500 py-4">لا يوجد نشاط حديث</div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
