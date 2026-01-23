export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative font-sans selection:bg-cyan-500/30" dir="rtl">

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -translate-y-1/2 opacity-50" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 opacity-50" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="w-full max-w-md animate-fade-in-up">
                {/* Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 transition-all hover:border-white/10">
                    {children}
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-xs text-slate-500 flex justify-center gap-6">
                    <a href="#" className="hover:text-slate-400">سياسة الخصوصية</a>
                    <a href="#" className="hover:text-slate-400">شروط الاستخدام</a>
                </div>
            </div>

        </div>
    );
}
