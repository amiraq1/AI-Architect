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

                {/* Headline - SEO Optimized */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100">
                    أول ذكاء اصطناعي عراقي <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm">
                        يفهم لهجتك وثقافتك
                    </span>
                </h1>

                {/* Subhead - SEO Optimized (Long-tail keywords) */}
                <h2 className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-fade-in-up delay-200 font-medium">
                    نبض هو **المساعد الشخصي العربي** الأكثر تطوراً للمبرمجين، الكتاب، والطلاب.
                    اكتب باللهجة العراقية أو العربية الفصحى واحصل على إجابات دقيقة، أكواد برمجية، وتحليل بيانات فوري.
                </h2>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300 mt-12">
                    <Button href="/chat" variant="neon" size="lg" className="w-full sm:w-auto px-10 py-5 text-xl">
                        ابدأ الحديث الآن مجاناً
                    </Button>
                    <Button href="#demo" variant="secondary" size="lg" className="w-full sm:w-auto group">
                        <span className="group-hover:text-cyan-400 transition-colors">شاهد كيف يعمل</span>
                        <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">▶</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}
