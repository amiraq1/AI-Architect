import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { PricingCard } from '@/components/pricing/PricingCard';

export const metadata = {
    title: 'الأسعار | نبض AI',
    description: 'اختر الباقة المناسبة لاحتياجاتك. ابدأ مجاناً وقم بالترقية عندما تحتاج.',
};

const PLANS = [
    {
        title: "البداية",
        price: "0",
        period: "د.ع",
        description: "مثالية لتجربة قوة الذكاء الاصطناعي العراقي.",
        ctaText: "ابدأ مجاناً",
        ctaVariant: "secondary" as const,
        features: [
            { text: "50 رسالة يومياً", included: true },
            { text: "موديل Llama 3 السريع (8B)", included: true },
            { text: "ذاكرة محادثة قصيرة المدى", included: true },
            { text: "تحليل الملفات", included: false },
            { text: "موديل العبقري (70B)", included: false },
        ]
    },
    {
        title: "مُحترف",
        price: "15,000",
        period: "د.ع / شهرياً",
        description: "للأفراد المبدعين والمطورين الذين يحتاجون إلى أداء فائق.",
        isPopular: true,
        ctaText: "اشترك الآن",
        ctaVariant: "primary" as const,
        features: [
            { text: "رسائل غير محدودة", included: true },
            { text: "موديل العبقري (70B & 405B)", included: true },
            { text: "تحليل المستندات والصور", included: true },
            { text: "ذاكرة طويلة المدى للمشاريع", included: true },
            { text: "أولوية في سرعة الاستجابة", included: true },
        ]
    },
    {
        title: "أعمال",
        price: "40,000",
        period: "د.ع / شهرياً",
        description: "للشركات الصغيرة والفرق التي تحتاج إلى تحكم كامل.",
        ctaText: "تواصل معنا",
        ctaVariant: "glow" as const,
        features: [
            { text: "كل مميزات المحترف", included: true },
            { text: "لوحة تحكم للإدارة", included: true },
            { text: "فريق عمل مشترك (حتى 5)", included: true },
            { text: "API Access", included: true },
            { text: "دعم فني مخصص 24/7", included: true },
        ]
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30" dir="rtl">
            <Navbar />

            <main className="pt-32 pb-24 relative overflow-hidden">

                {/* Background Gradients */}
                <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            استثمر في إنتاجيتك مع <span className="text-cyan-400">نبض</span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            أسعار شفافة وبسيطة. اختر الخطة التي تناسب طموحك.
                            <br className="hidden md:block" />
                            يمكنك الإلغاء في أي وقت.
                        </p>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto mb-32 animate-fade-in-up delay-100">
                        {PLANS.map((plan, idx) => (
                            <PricingCard key={idx} {...plan} />
                        ))}
                    </div>

                    {/* FAQ Section (Optional/Simple) */}
                    <div className="max-w-3xl mx-auto border-t border-white/5 pt-20 animate-fade-in-up delay-200">
                        <h2 className="text-2xl font-bold text-center mb-12">أسئلة شائعة</h2>
                        <div className="grid gap-8">
                            <div className="bg-slate-900/30 p-6 rounded-2xl border border-white/5">
                                <h3 className="font-bold text-white mb-2">هل يمكنني تجربة الخطة المدفوعة مجاناً؟</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">نعم، نقدم فترة تجربة لمدة 3 أيام لجميع مميزات خطة "محترف" لتتأكد من ملاءمتها لك.</p>
                            </div>
                            <div className="bg-slate-900/30 p-6 rounded-2xl border border-white/5">
                                <h3 className="font-bold text-white mb-2">كيف يتم الدفع؟</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">نقبل جميع البطاقات المحلية (زين كاش، ماستركارد، فيزا) عبر بوابة دفع آمنة ومشفرة.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
