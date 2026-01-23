import React from 'react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex font-sans" dir="rtl">

            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        نبض - المسؤول
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="flex items-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors">
                        <span className="ml-3">📊</span>
                        نظرة عامة
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                        <span className="ml-3">👥</span>
                        المستخدمين
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                        <span className="ml-3">💬</span>
                        المحادثات
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                        <span className="ml-3">⚙️</span>
                        الإعدادات
                    </a>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold ml-3">
                            م
                        </div>
                        <div>
                            <p className="text-sm font-medium">المدير العام</p>
                            <p className="text-xs text-gray-500">admin@nabd.ai</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">مرحباً بك مرة أخرى، إليك ملخص أداء النظام اليوم.</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors">
                        تحديث البيانات
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">المستخدمين النشطين</h3>
                            <span className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">👥</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">1,248</p>
                        <p className="text-sm text-green-500 flex items-center mt-2">
                            <span className="ml-1">↑</span>
                            <span>12%</span>
                            <span className="text-gray-400 mr-2">من الأسبوع الماضي</span>
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المحادثات</h3>
                            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">💬</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">45,392</p>
                        <p className="text-sm text-green-500 flex items-center mt-2">
                            <span className="ml-1">↑</span>
                            <span>8%</span>
                            <span className="text-gray-400 mr-2">من الأمس</span>
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">استهلاك الـ API</h3>
                            <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">⚡</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">89%</p>
                        <p className="text-sm text-yellow-500 flex items-center mt-2">
                            <span className="ml-1">⚠</span>
                            <span>مرتفع</span>
                            <span className="text-gray-400 mr-2">الحد اليومي</span>
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">حالة النظام</h3>
                            <span className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">🖥️</span>
                        </div>
                        <p className="text-xl font-bold text-green-500">مستقر ✅</p>
                        <p className="text-sm text-gray-400 mt-2">آخر تحديث: قبل دقيقة</p>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">النشاطات الأخيرة</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراء</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الوقت</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {[
                                    { user: 'أحمد محمد', action: 'بدء محادثة جديدة', time: 'منذ 5 دقائق', status: 'مكتمل' },
                                    { user: 'سارة علي', action: 'تسجيل دخول', time: 'منذ 15 دقيقة', status: 'مكتمل' },
                                    { user: 'خالد عمر', action: 'توليد كود بايثون', time: 'منذ 25 دقيقة', status: 'جاري المعالجة' },
                                    { user: 'منى يوسف', action: 'تحديث الملف الشخصي', time: 'منذ ساعة', status: 'مكتمل' },
                                ].map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.user}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.action}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{item.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}
