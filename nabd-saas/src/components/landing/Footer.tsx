import Link from 'next/link';
import { FiTwitter, FiInstagram, FiGithub, FiLinkedin } from 'react-icons/fi';

export function Footer() {
    return (
        <footer className="relative pt-24 pb-12 border-t border-white/5 bg-slate-950 overflow-hidden">

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 group mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/20">
                                ن
                            </div>
                            <span className="text-2xl font-bold text-white">نبض AI</span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            المساعد الشخصي العربي الأول الذي يفهمك، يخطط معك، وينفذ مهامك بذكاء.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<FiTwitter />} href="#" />
                            <SocialIcon icon={<FiGithub />} href="#" />
                            <SocialIcon icon={<FiLinkedin />} href="#" />
                            <SocialIcon icon={<FiInstagram />} href="#" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <FooterColumn
                        title="المنتج"
                        links={[
                            { label: "المميزات", href: "#features" },
                            { label: "الأسعار", href: "#pricing" },
                            { label: "واجهة API", href: "#" },
                            { label: "تحديثات", href: "#" },
                        ]}
                    />

                    <FooterColumn
                        title="الشركة"
                        links={[
                            { label: "عن نبض", href: "#" },
                            { label: "المدونة", href: "#" },
                            { label: "الوظائف", href: "#" },
                            { label: "اتصل بنا", href: "#" },
                        ]}
                    />

                    <FooterColumn
                        title="قانوني"
                        links={[
                            { label: "الخصوصية", href: "#" },
                            { label: "الشروط", href: "#" },
                            { label: "الأمان", href: "#" },
                        ]}
                    />
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} نبض AI. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex gap-2 items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs text-emerald-400 font-medium tracking-wide">الأنظمة تعمل بكفاءة 100%</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Helper Components
function FooterColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
    return (
        <div>
            <h4 className="font-bold text-white mb-6 text-lg">{title}</h4>
            <ul className="space-y-4">
                {links.map((link, i) => (
                    <li key={i}>
                        <a href={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 block w-fit">
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a href={href} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
            {icon}
        </a>
    );
}
