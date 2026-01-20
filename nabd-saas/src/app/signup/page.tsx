'use client';

import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative" dir="rtl">

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] translate-y-1/2" />
            </div>

            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/20 mb-4">
                        🚀
                    </div>
                    <h1 className="text-2xl font-bold text-white">انضم إلى عائلة نبض</h1>
                    <p className="text-slate-400 mt-2 text-sm">أنشئ حسابك المجاني وابدأ رحلتك</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الكامل</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="مثلاً: علي محمد"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors text-right"
                            placeholder="name@example.com"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors text-right"
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </div>

                    <Link
                        href="/chat"
                        className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-center hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                    >
                        إنشاء حساب جديد
                    </Link>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm">
                        لديك حساب بالفعل؟{' '}
                        <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300">
                            تسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
