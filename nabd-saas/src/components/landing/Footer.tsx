export function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-slate-950 relative overflow-hidden">

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white font-bold text-sm">
                        ن
                    </div>
                    <span className="text-slate-500 font-medium text-sm">© 2026 نبض AI. جميع الحقوق محفوظة.</span>
                </div>

                <div className="flex gap-8 text-sm text-slate-500 font-medium">
                    <a href="#" className="hover:text-cyan-400 transition-colors">تويتر</a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">تلجرام</a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">اتصل بنا</a>
                </div>
            </div>
        </footer>
    );
}
