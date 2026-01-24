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
                    أول ذكاء اصطناعي عراقي <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm">
                        يفهم لهجتك وثقافتك
                    </span>
                </h1>

                {/* Subhead */}
                <h2 className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-fade-in-up delay-200 font-medium">
                    نبض هو <span className="text-white font-bold border-b border-cyan-500/30">المساعد الشخصي العربي</span> الأكثر تطوراً للمبرمجين، الكتاب، والطلاب.
                    اكتب باللهجة العراقية أو العربية الفصحى واحصل على إجابات دقيقة، أكواد برمجية، وتحليل بيانات فوري.
                </h2>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300 mt-12 mb-20">
                    <Button href="/chat" variant="neon" size="lg" className="w-full sm:w-auto px-10 py-5 text-xl">
                        ابدأ الحديث الآن مجاناً
                    </Button>
                    <Button href="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto group">
                        <span className="group-hover:text-cyan-400 transition-colors">عرض خطط الأسعار</span>
                        <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">←</span>
                    </Button>
                </div>

                {/* 🌟 Social Proof */}
                <div className="animate-fade-in-up delay-500 flex flex-col items-center gap-4 mb-24">
                    <div className="flex items-center -space-x-4 space-x-reverse">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs font-bold text-white z-10">
                            +1k
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">
                        لدينا ثقة أكثر من <span className="text-white font-bold">1,000 مستخدم عراقي</span>
                    </div>
                </div>

                {/* 🖥️ Mock Chat Interface */}
                <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/80 backdrop-blur-sm animate-fade-in-up delay-700 group perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

                    {/* Window Controls */}
                    <div className="h-10 border-b border-white/5 bg-slate-900/50 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        <div className="mx-auto text-xs text-slate-500 font-mono">nabd-ai-demo.tsx</div>
                    </div>

                    {/* Chat Area */}
                    <div className="p-8 font-mono text-right text-sm md:text-base space-y-6">
                        <div className="flex gap-4 justify-end">
                            <div className="bg-cyan-500/10 text-cyan-200 px-4 py-3 rounded-2xl rounded-tr-none border border-cyan-500/20 max-w-[80%]">
                                شلونك نبض؟ ممكن تكتب لي كود بايثون يحلل البيانات؟
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
                        </div>

                        <div className="flex gap-4 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 grid place-items-center text-white text-xs">🤖</div>
                            <div className="bg-slate-800/50 text-slate-300 px-6 py-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[90%] text-left" dir="ltr">
                                <div className="text-right text-white mb-3 dir-rtl font-sans font-bold">أهلاً بك! بالتأكيد، تفضل هذا الكود:</div>
                                <div className="text-pink-400">import</div> <span className="text-white">pandas</span> <div className="text-pink-400">as</div> <span className="text-white">pd</span>
                                <br />
                                <div className="text-purple-400">def</div> <span className="text-blue-400">analyze_data</span>(file_path):
                                <br />
                                &nbsp;&nbsp;df = pd.read_csv(file_path)
                                <br />
                                &nbsp;&nbsp;<div className="text-pink-400">return</div> df.describe()
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
