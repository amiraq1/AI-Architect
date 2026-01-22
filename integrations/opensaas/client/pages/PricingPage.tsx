/**
 * PricingPage - صفحة الأسعار
 * عرض خطط الاشتراك المتاحة
 */

import React from 'react';

interface PricingTier {
    name: string;
    nameAr: string;
    price: string;
    priceMonthly: string;
    description: string;
    features: string[];
    highlighted: boolean;
    buttonText: string;
    buttonStyle: string;
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Free',
        nameAr: 'مجاني',
        price: '$0',
        priceMonthly: '/شهرياً',
        description: 'للمستخدمين الجدد الذين يريدون تجربة نبض',
        features: [
            '50 رسالة يومياً',
            'نموذج سريع (8B)',
            'الوكلاء الأساسيين',
            'سجل محادثات لمدة 7 أيام',
            'دعم عبر المجتمع',
        ],
        highlighted: false,
        buttonText: 'ابدأ مجاناً',
        buttonStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
    },
    {
        name: 'Pro',
        nameAr: 'احترافي',
        price: '$9',
        priceMonthly: '/شهرياً',
        description: 'للمحترفين الذين يحتاجون المزيد من القوة',
        features: [
            'رسائل غير محدودة',
            'نموذج ذكي (70B)',
            'جميع الوكلاء',
            'أداة تصفح الويب',
            'تحليل الصور',
            'سجل محادثات دائم',
            'دعم أولوي',
            'API Access',
        ],
        highlighted: true,
        buttonText: 'اشترك الآن',
        buttonStyle: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25',
    },
    {
        name: 'Enterprise',
        nameAr: 'مؤسسي',
        price: 'تواصل معنا',
        priceMonthly: '',
        description: 'للشركات والمؤسسات الكبيرة',
        features: [
            'كل مميزات Pro',
            'نماذج مخصصة',
            'تدريب على بياناتك',
            'تكامل API كامل',
            'SLA مضمون',
            'مدير حساب مخصص',
            'تثبيت داخلي (On-Premise)',
            'أمان متقدم',
        ],
        highlighted: false,
        buttonText: 'تواصل معنا',
        buttonStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            ن
                        </div>
                        <span className="font-bold text-lg">نبض AI</span>
                    </a>
                    <nav className="flex items-center gap-4">
                        <a href="/" className="text-slate-400 hover:text-white transition-colors">الرئيسية</a>
                        <a href="/chat" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition-colors">
                            ابدأ الآن
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            خطط الأسعار
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        اختر الخطة المناسبة لاحتياجاتك. جميع الخطط تتضمن تحديثات مجانية ودعم فني.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`
                                relative rounded-2xl p-8 border transition-all duration-300
                                ${tier.highlighted
                                    ? 'bg-slate-900/80 border-cyan-500/50 shadow-xl shadow-cyan-500/10 scale-105'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                }
                            `}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm font-bold">
                                    الأكثر شعبية ⭐
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-lg font-medium text-slate-400 mb-2">{tier.nameAr}</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    <span className="text-slate-500">{tier.priceMonthly}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-3">{tier.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3 text-slate-300">
                                        <span className="text-cyan-400">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${tier.buttonStyle}`}>
                                {tier.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-slate-900/30 border-t border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                            <h3 className="font-bold text-lg mb-2">هل يمكنني إلغاء اشتراكي في أي وقت؟</h3>
                            <p className="text-slate-400">نعم، يمكنك إلغاء اشتراكك في أي وقت دون أي رسوم إضافية.</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                            <h3 className="font-bold text-lg mb-2">ما الفرق بين النموذج السريع والذكي؟</h3>
                            <p className="text-slate-400">النموذج السريع (8B) يقدم ردود سريعة للمهام البسيطة، بينما النموذج الذكي (70B) يفهم السياق بشكل أعمق ويقدم إجابات أكثر دقة.</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                            <h3 className="font-bold text-lg mb-2">هل بياناتي آمنة؟</h3>
                            <p className="text-slate-400">نعم، نستخدم تشفير من الدرجة البنكية ولا نشارك بياناتك مع أي طرف ثالث.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-slate-800 text-center text-slate-500">
                <p>© 2026 نبض AI. جميع الحقوق محفوظة.</p>
            </footer>
        </div>
    );
}
