'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import ChatInput from './ChatInput';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════════════════════════════════════

const AGENT_MODES = [
    { id: 'general', name: 'مساعد عام', icon: '🤖' },
    { id: 'coder', name: 'مبرمج', icon: '👨‍💻' },
    { id: 'writer', name: 'كاتب', icon: '📝' },
    { id: 'researcher', name: 'باحث', icon: '🔍' },
];

const QUICK_ACTIONS = [
    'ما هي آخر أخبار التكنولوجيا؟',
    'اكتب لي كود بايثون',
    'لخص هذا المقال',
    'تحليل بيانات السوق'
];

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'error';
    content: string;
    plan?: string[];
    attachment?: {
        name: string;
        type: string;
    };
}

// Helper to convert file to Base64
const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [agentMode, setAgentMode] = useState('general');
    const [modelName, setModelName] = useState('llama-3.1-8b-instant');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (messageText: string, file: File | null) => {
        if (!messageText.trim() && !file) return;

        let attachmentData = null;
        let displayContent = messageText;

        if (file) {
            try {
                const base64Content = await convertFileToBase64(file);
                attachmentData = {
                    name: file.name,
                    type: file.type,
                    content: base64Content
                };
                // Adding a visual indicator to the user message
                if (!displayContent) displayContent = `[مرفق: ${file.name}]`;
            } catch (error) {
                console.error("File conversion error:", error);
                alert("فشل في قراءة الملف المرفق");
                return;
            }
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: displayContent,
            attachment: attachmentData ? { name: attachmentData.name, type: attachmentData.type } : undefined
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/nabd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: messageText, // The prompt text
                    agentMode,
                    modelName,
                    attachment: attachmentData // The full file data
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: data.result || data.response || JSON.stringify(data),
                    plan: data.plan,
                },
            ]);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'error',
                    content: errorMessage,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedAgent = AGENT_MODES.find((a) => a.id === agentMode)!;

    return (
        <div className="flex bg-slate-950 text-slate-100 font-sans h-[100dvh] overflow-hidden" dir="rtl">

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 right-0 z-40 h-full w-72 bg-slate-900 border-l border-slate-800 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:static lg:translate-x-0 lg:w-64 xl:w-72
        `}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                ن
                            </div>
                            <span className="font-bold text-lg">بوابة نبض</span>
                        </Link>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 px-4 mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/10 active:scale-95"
                    >
                        <span>محادثة جديدة</span>
                        <span className="text-xl leading-none">➕</span>
                    </button>

                    <nav className="flex-1 space-y-2">
                        <div className="text-xs font-semibold text-slate-500 mb-2 px-2">الرئيسية</div>
                        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                            <span>🏠</span> الصفحة الرئيسية
                        </Link>
                        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 text-cyan-400 rounded-lg font-medium cursor-default">
                            <span>💬</span> المحادثة الحالية
                        </div>

                        <div className="mt-8 text-xs font-semibold text-slate-500 mb-2 px-2">الإعدادات</div>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-right">
                            <span>⚙️</span> الإعدادات العامة
                        </button>
                        <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors mt-auto">
                            <span>🚪</span> تسجيل خروج
                        </Link>
                    </nav>

                    <div className="mt-auto pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs">👤</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">مستخدم زائر</span>
                                <span className="text-xs text-slate-500">Free Plan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative">

                {/* Header */}
                <header className="flex-none h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{selectedAgent.name}</span>
                                <span className="text-lg">{selectedAgent.icon}</span>
                            </h1>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span>مفعل</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setModelName(prev => prev.includes('8b') ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant')}
                        className={`
              px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2
              ${modelName.includes('70b')
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'}
            `}
                    >
                        <span>{modelName.includes('70b') ? 'ذكي 🧠' : 'سريع 🚀'}</span>
                    </button>
                </header>

                <div className="w-full overflow-x-auto no-scrollbar border-b border-slate-800 bg-slate-950/50 py-2 flex-none">
                    <div className="flex px-4 gap-2 min-w-max">
                        {AGENT_MODES.map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => setAgentMode(agent.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${agentMode === agent.id
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                                    }`}
                            >
                                <span>{agent.icon}</span>
                                <span>{agent.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <main className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 shadow-xl">
                                <span className="text-3xl">{selectedAgent.icon}</span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-6">كيف يمكنني مساعدتك اليوم؟</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
                                {QUICK_ACTIONS.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(prompt, null)}
                                        className="p-3 text-right text-xs bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 rounded-xl text-slate-300 transition-all active:scale-98"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex w-full animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-start' : 'justify-end'
                                }`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed break-words ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : msg.role === 'error'
                                        ? 'bg-red-500/10 text-red-200 border border-red-500/20'
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                    }`}
                            >
                                {msg.attachment && (
                                    <div className="flex items-center gap-2 mb-2 bg-black/20 p-2 rounded-lg">
                                        <span className="text-xl">📎</span>
                                        <span className="text-xs truncate max-w-[150px]">{msg.attachment.name}</span>
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                {msg.plan && msg.plan.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
                                        {msg.plan.map((step, i) => (
                                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-black/20 text-cyan-200">
                                                {step}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-end w-full">
                            <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-1" />
                </main>

                <footer className="flex-none p-3 bg-slate-950 border-t border-slate-800">
                    <ChatInput onSubmit={handleSend} isLoading={isLoading} />
                </footer>

            </div>
        </div>
    );
}
