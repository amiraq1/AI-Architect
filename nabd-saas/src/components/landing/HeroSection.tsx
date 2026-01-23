import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">

            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 opacity-50 mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/2 opacity-50 mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-cyan-400 text-xs font-bold mb-8 backdrop-blur-md shadow-lg shadow-cyan-900/20 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="tracking-wide">الجيل الجديد من الذكاء الاصطناعي العربي</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100">
                    ذكاء اصطناعي عراقي.. <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm">
                        يفهمك ويفهم لهجتك
                    </span>
                </h1>

                {/* Subhead */}
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-fade-in-up delay-200">
                    منصة متكاملة للمبرمجين، الكتاب، والباحثين. نبض هو مساعدك الشخصي الذي يعمل بلهجتك،
                    يخطط لمشاريعك، وينفذ المهام المعقدة بسرعة البرق.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                    <Button href="/chat" variant="primary" size="lg" className="w-full sm:w-auto shadow-xl shadow-cyan-500/20">
                        ابدأ الحديث الآن مجاناً
                    </Button>
                    <Button href="#demo" variant="secondary" size="lg" className="w-full sm:w-auto">
                        شاهد كيف يعمل ▶
                    </Button>
                </div>
            </div>
        </section>
    );
}
