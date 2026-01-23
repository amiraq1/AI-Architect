'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import AuthLayout from '@/components/auth/AuthLayout';
import { SocialButtons, Divider } from '@/components/auth/SocialComponents';

export default function SignupPage() {
    return (
        <AuthLayout>
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <Link href="/" className="group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/20 mb-4 group-hover:scale-110 transition-transform">
                        ن
                    </div>
                </Link>
                <h1 className="text-2xl font-bold text-white">انضم إلى نبض</h1>
                <p className="text-slate-400 mt-2 text-sm">ابدأ رحلتك مع الذكاء الاصطناعي اليوم</p>
            </div>

            <SocialButtons />
            <Divider />

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">الاسم الأول</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all text-right" placeholder="محمد" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">اسم العائلة</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all text-right" placeholder="علي" />
                    </div>
                </div>

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
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">كلمة المرور</label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-right shadow-inner"
                        placeholder="••••••••"
                        dir="ltr"
                    />
                    <p className="mt-2 text-[10px] text-slate-500">يجب أن تحتوي على 8 أحرف وعلامة واحدة على الأقل.</p>
                </div>

                <Button href="/chat" variant="primary" className="w-full py-3.5 shadow-xl shadow-purple-900/20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                    إنشاء حساب مجاني
                </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-800/50">
                <p className="text-slate-400 text-sm">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-all">
                        سجل الدخول هنا
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
