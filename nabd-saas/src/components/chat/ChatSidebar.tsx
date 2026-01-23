import Link from 'next/link';
import { Message } from '@/types/chat';

interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onNewChat: () => void;
    messagesCount: number;
}

export function ChatSidebar({ isOpen, onClose, onNewChat, messagesCount }: ChatSidebarProps) {
    // Common Classes
    const itemClass = "flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group";
    const iconClass = "text-lg opacity-70 group-hover:opacity-100 transition-opacity";

    return (
        <>
            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            <aside className={`
        fixed lg:static inset-y-0 right-0 z-50
        w-[280px] lg:w-72
        bg-slate-950/95 lg:bg-transparent
        border-l border-white/5 lg:border-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 mb-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                            ن
                        </div>
                        <span className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">بوابة نبض</span>
                    </Link>
                </div>

                {/* New Chat Button */}
                <div className="px-4 mb-6">
                    <button
                        onClick={onNewChat}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-98 transition-all duration-200"
                    >
                        <span>محادثة جديدة</span>
                        <span className="text-xl leading-none">+</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 mb-2 mt-4">القائمة</div>

                    <Link href="/" className={itemClass}>
                        <span className={iconClass}>🏠</span>
                        <span className="font-medium">الرئيسية</span>
                    </Link>

                    <div className="flex items-center gap-3 px-3 py-2 bg-white/5 text-cyan-400 rounded-lg cursor-default border border-white/5">
                        <span className="text-lg">💬</span>
                        <span className="font-medium">المحادثة الحالية</span>
                        {messagesCount > 0 && (
                            <span className="mr-auto text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full">{messagesCount}</span>
                        )}
                    </div>

                    <div className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 mb-2 mt-8">الحساب</div>

                    <Link href="/pricing" className={itemClass}>
                        <span className={iconClass}>💎</span>
                        <span className="font-medium">الأسعار والاشتراكات</span>
                    </Link>

                    <button className={`${itemClass} w-full text-right`}>
                        <span className={iconClass}>⚙️</span>
                        <span className="font-medium">الإعدادات</span>
                    </button>

                    <Link href="/login" className={`${itemClass} hover:bg-red-500/10 hover:text-red-300`}>
                        <span className={iconClass}>🚪</span>
                        <span className="font-medium">تسجيل خروج</span>
                    </Link>
                </nav>

                {/* User Profile / Status */}
                <div className="p-4 mt-auto border-t border-white/5">
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                            <span>الرصيد المتبقي</span>
                            <span className="text-white font-bold">50 / 50</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-full" />
                        </div>
                    </div>
                </div>

            </aside>
        </>
    );
}
