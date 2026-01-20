import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30" dir="rtl">

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] translate-y-1/2" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-slate-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-cyan-500/20">
                  ن
                </div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                نبض AI
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">المميزات</a>
              <a href="#pricing" className="hover:text-white transition-colors">الأسعار</a>
              <a href="#" className="hover:text-white transition-colors">عن نبض</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                دخول
              </Link>
              <Link
                href="/chat"
                className="px-5 py-2 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-cyan-50 transition-all shadow-lg shadow-white/10 active:scale-95"
              >
                جرب نبض مجاناً 🚀
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-cyan-400 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>الجيل الجديد من الذكاء الاصطناعي العربي</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            ذكاء اصطناعي عراقي.. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              يفهمك ويفهم لهجتك
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            منصة متكاملة للمبرمجين، الكتاب، والباحثين. نبض هو مساعدك الشخصي الذي يعمل بلهجتك،
            يخطط لمشاريعك، وينفذ المهام المعقدة بسرعة البرق.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              ابدأ الحديث الآن مجاناً
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 transition-all active:scale-95"
            >
              شاهد كيف يعمل ▶
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 bg-slate-900/50 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">لماذا نبض هو الأفضل؟</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">صمم نبض ليكون أكثر من مجرد شات بوت، إنه نظام تشغيل متكامل لإنتاجيتك.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform text-cyan-500">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-3">سريع وخفيف</h3>
              <p className="text-slate-400 leading-relaxed">
                استجابات فورية باستخدام نماذج Llama 3 المصغرة، مصممة لتعمل بسرعة حتى على اتصالات الإنترنت الضعيفة.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform text-purple-500">
                🧠
              </div>
              <h3 className="text-xl font-bold text-white mb-3">يفهم السياق</h3>
              <p className="text-slate-400 leading-relaxed">
                ذاكرة طويلة الأمد تتذكر تفضيلاتك ومشاريعك السابقة، فلا داعي لتكرار نفسك في كل مرة.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform text-emerald-500">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">آمن ومحمي</h3>
              <p className="text-slate-400 leading-relaxed">
                بياناتك مشفرة ومحمية. نحن نلتزم بأعلى معايير الخصوصية ولا نشارك محادثاتك مع أطراف ثالثة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-800/50 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-sm">
              ن
            </div>
            <span className="text-slate-500 font-medium">© 2026 نبض AI. جميع الحقوق محفوظة.</span>
          </div>

          <div className="flex gap-6 text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">تويتر</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">تلجرام</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">اتصل بنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
