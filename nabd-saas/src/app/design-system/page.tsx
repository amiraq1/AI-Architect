'use client';

import { Button } from "@/components/ui/Button";
import { CommandInput } from "@/components/chat/CommandInput";
import { FiZap, FiCpu, FiShield } from 'react-icons/fi';

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-12 space-y-20" dir="rtl">

            {/* Header */}
            <header className="text-center space-y-4 animate-fade-in-up">
                <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                    نظام تصميم "سديم" (Deep Nebula)
                </h1>
                <p className="text-xl text-slate-400">دليل الأسلوب البصري لمشروع نبض</p>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
            </header>

            {/* Typography */}
            <section className="space-y-8 p-8 border border-white/5 rounded-3xl bg-slate-900/30 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-cyan-400 mb-8 border-b border-white/5 pb-4">1. الطباعة (Typography)</h2>

                <div className="space-y-6">
                    <div>
                        <p className="text-xs text-slate-500 mb-2 font-mono">H1 / Cairo Bold</p>
                        <h1 className="text-5xl font-bold">العنوان الرئيسي للموقع</h1>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-2 font-mono">H2 / Cairo Bold</p>
                        <h2 className="text-3xl font-bold">عنوان قسم فرعي مهم</h2>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-2 font-mono">Body / Cairo Regular</p>
                        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-arabic-body">
                            هذا نص تجريبي لاستعراض خط الفقرات. يتميز خط "كايرو" بوضوحه العالي وملاءمته للشاشات الرقمية،
                            مما يجعله مثالياً للقراءة الطويلة في واجهات المحادثة والمقالات.
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-2 font-mono">Code / JetBrains Mono</p>
                        <code className="bg-slate-800 p-3 rounded-lg text-cyan-300 font-mono text-sm block w-fit">
                            npm install @nabd/ui-kit --save
                        </code>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <section className="space-y-8 p-8 border border-white/5 rounded-3xl bg-slate-900/30 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-cyan-400 mb-8 border-b border-white/5 pb-4">2. الأزرار (Buttons)</h2>

                <div className="flex flex-wrap gap-6 items-center">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="neon" size="lg">Neon Action ⚡</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="glow">Glow Effect</Button>
                    <Button variant="ghost">Transparent</Button>
                </div>

                <div className="flex flex-wrap gap-6 items-center mt-8">
                    <p className="text-sm text-slate-500">Sizes:</p>
                    <Button size="sm" variant="primary">Small</Button>
                    <Button size="md" variant="primary">Medium</Button>
                    <Button size="lg" variant="primary">Large</Button>
                </div>
            </section>

            {/* Cards & Glassmorphism */}
            <section className="space-y-8 p-8 border border-white/5 rounded-3xl bg-slate-900/30 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-cyan-400 mb-8 border-b border-white/5 pb-4">3. البطاقات (Glassmorphism)</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "زجاج عادي", color: "cyan" },
                        { title: "توهج بنفسجي", color: "purple" },
                        { title: "توهج أخضر", color: "emerald" },
                    ].map((card, i) => (
                        <div key={i} className={`relative group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-${card.color}-500/50 transition-all duration-500 hover:shadow-2xl`}>
                            <div className="bg-slate-950/90 backdrop-blur-xl p-8 rounded-[22px] h-full border border-white/5 group-hover:-translate-y-2 transition-transform duration-500">
                                <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/20 flex items-center justify-center mb-4 text-2xl`}>✨</div>
                                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                                <p className="text-slate-400">تأثير زجاجي متطور يستجيب لحركة الماوس مع حدود متدرجة.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Inputs */}
            <section className="space-y-8 p-8 border border-white/5 rounded-3xl bg-slate-900/30 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-cyan-400 mb-8 border-b border-white/5 pb-4">4. حقول الإدخال (Inputs)</h2>

                <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 shadow-inner">
                    <CommandInput onSubmit={() => { }} />
                </div>
            </section>

        </div>
    );
}
