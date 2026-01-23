import { FiZap, FiCpu, FiShield } from 'react-icons/fi';

const features = [
    {
        icon: <FiZap className="w-6 h-6" />,
        title: "سريع وخفيف",
        description: "استجابات فورية باستخدام نماذج Llama 3 المصغرة، مصممة لتعمل بسرعة حتى على اتصالات الإنترنت الضعيفة.",
        color: "text-cyan-500",
        bgHover: "group-hover:border-cyan-500/30",
        iconBg: "group-hover:text-cyan-400"
    },
    {
        icon: <FiCpu className="w-6 h-6" />,
        title: "يفهم السياق",
        description: "ذاكرة طويلة الأمد تتذكر تفضيلاتك ومشاريعك السابقة، فلا داعي لتكرار نفسك في كل مرة.",
        color: "text-purple-500",
        bgHover: "group-hover:border-purple-500/30",
        iconBg: "group-hover:text-purple-400"
    },
    {
        icon: <FiShield className="w-6 h-6" />,
        title: "آمن ومحمي",
        description: "بياناتك مشفرة ومحمية. نحن نلتزم بأعلى معايير الخصوصية ولا نشارك محادثاتك مع أطراف ثالثة.",
        color: "text-emerald-500",
        bgHover: "group-hover:border-emerald-500/30",
        iconBg: "group-hover:text-emerald-400"
    }
];

export function FeaturesGrid() {
    return (
        <section id="features" className="relative py-32 bg-slate-900/30 border-y border-white/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">لماذا نبض هو الأفضل؟</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">صمم نبض ليكون أكثر من مجرد شات بوت، إنه نظام تشغيل متكامل لإنتاجيتك.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-3xl bg-slate-950 border border-slate-800 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 ${feature.bgHover}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 transition-colors duration-300 ${feature.color} ${feature.iconBg}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
