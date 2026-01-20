'use client';

import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative" dir="rtl">

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2" />
            </div>

            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/20 mb-4">
                        ن
                    </div>
                    <h1 className="text-2xl font-bold text-white">أهلاً بك مجدداً</h1>
                    <p className="text-slate-400 mt-2 text-sm">سجل دخولك للمتابعة إلى نبض</p>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                            placeholder="name@example.com"
                            dir="ltr" // Email usually LTR
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-300">كلمة المرور</label>
                            <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">نسيت كلمة المرور؟</a>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </div>

                    <Link
                        href="/chat"
                        className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-center hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        تسجيل الدخول
                    </Link>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm">
                        ليس لديك حساب؟{' '}
                        <Link href="/signup" className="text-cyan-400 font-bold hover:text-cyan-300">
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
