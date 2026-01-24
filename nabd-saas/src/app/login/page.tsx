'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import AuthLayout from '@/components/auth/AuthLayout';
import { SocialButtons, Divider } from '@/components/auth/SocialComponents';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else {
                // Successful login
                router.push('/chat');
                router.refresh();
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع');
        } finally {
            setIsLoading(false);
        }
    };

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

            <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">البريد الإلكتروني</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-right shadow-inner"
                        placeholder="admin@nabd.com"
                        dir="ltr"
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">كلمة المرور</label>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-right shadow-inner"
                        placeholder="••••••••"
                        dir="ltr"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3.5 shadow-xl shadow-cyan-900/20"
                    disabled={isLoading}
                >
                    {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
                </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-800/50">
                <p className="text-slate-400 text-sm">
                    حساب تجريبي: <br />
                    <span className="font-mono text-cyan-400">admin@nabd.com / admin123</span>
                </p>
                <div className="mt-4">
                    <p className="text-slate-400 text-sm">
                        ليس لديك حساب؟{' '}
                        <Link href="/signup" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-all">
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
