'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import AuthLayout from '@/components/auth/AuthLayout';
import { SocialButtons, Divider } from '@/components/auth/SocialComponents';

export default function LoginPage() {
    return (
        <AuthLayout>
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <Link href="/" className="group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/20 mb-4 group-hover:scale-110 transition-transform">
                        ن
                    </div>
                </Link>
                <h1 className="text-2xl font-bold text-white">أهلاً بك مجدداً</h1>
                <p className="text-slate-400 mt-2 text-sm">سجل دخولك للمتابعة إلى بوابة نبض</p>
            </div>

            <SocialButtons />
            <Divider />

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">البريد الإلكتروني</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-right shadow-inner"
                        placeholder="name@example.com"
                        dir="ltr"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">كلمة المرور</label>
                        <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">نسيت كلمة المرور؟</a>
                    </div>
                    <input
                        type="password"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-right shadow-inner"
                        placeholder="••••••••"
                        dir="ltr"
                    />
                </div>

                <Button href="/chat" variant="primary" className="w-full py-3.5 shadow-xl shadow-cyan-900/20">
                    تسجيل الدخول
                </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-800/50">
                <p className="text-slate-400 text-sm">
                    ليس لديك حساب؟{' '}
                    <Link href="/signup" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-all">
                        إنشاء حساب جديد
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
