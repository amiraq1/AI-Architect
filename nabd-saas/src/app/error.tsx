'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => { console.error(error) }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 text-center" dir="rtl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 animate-pulse">
                <span className="text-4xl">🚨</span>
            </div>

            <h2 className="text-3xl font-bold mb-3 text-white">عذراً، حدث خطأ غير متوقع</h2>
            <p className="text-slate-400 mb-8 max-w-md text-lg leading-relaxed">
                واجه النظام مشكلة تقنية بسيطة. فريقنا قد تلقى تقريراً بذلك. يرجى المحاولة مرة أخرى.
            </p>

            <div className="flex gap-4">
                <Button onClick={reset} variant="primary" size="lg">
                    إعادة المحاولة
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="secondary" size="lg">
                    العودة للرئيسية
                </Button>
            </div>

            <div className="mt-12 p-4 bg-slate-900/50 rounded-xl border border-white/5 font-mono text-xs text-slate-600 max-w-lg overflow-x-auto text-left" dir="ltr">
                Error: {error.message || 'Unknown error occurred'}
            </div>
        </div>
    );
}
