'use client';

import { useState } from 'react';

// Mock Chat Data
const CHATS = [
    {
        id: 'c1',
        user: 'علي محمد',
        avatar: 'bg-purple-500',
        lastMessage: 'كيف أكتب دالة في بايثون لحساب المتوسط؟',
        time: 'منذ دقيقتين',
        model: 'Code Llama',
        tokens: 1540,
        sentiment: 'neutral'
    },
    {
        id: 'c2',
        user: 'سارة أحمد',
        avatar: 'bg-cyan-500',
        lastMessage: 'شكراً، هذا ساعدني كثيراً في كتابة المقال.',
        time: 'منذ 15 دقيقة',
        model: 'Llama 3 (70B)',
        tokens: 420,
        sentiment: 'positive'
    },
    {
        id: 'c3',
        user: 'Anonymous',
        avatar: 'bg-slate-500',
        lastMessage: 'System Error: Rate limit exceeded',
        time: 'منذ 3 ساعات',
        model: 'Gemma 7B',
        tokens: 0,
        sentiment: 'negative'
    },
];

export default function ChatsMonitorPage() {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6">

            {/* Chat List (Sidebar) */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">المحادثات المباشرة</h2>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded animate-pulse">Live</span>
                </div>

                <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b border-white/5">
                        <input
                            type="text"
                            placeholder="بحث في المحادثات..."
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                        />
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {CHATS.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`p-3 rounded-xl cursor-pointer transition-all ${selectedChat === chat.id
                                        ? 'bg-cyan-500/10 border border-cyan-500/30'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full ${chat.avatar} flex items-center justify-center text-xs text-white font-bold`}>
                                            {chat.user[0]}
                                        </div>
                                        <span className={`font-bold text-sm ${selectedChat === chat.id ? 'text-cyan-400' : 'text-slate-200'}`}>
                                            {chat.user}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500">{chat.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pr-10">
                                    {chat.lastMessage}
                                </p>
                                <div className="flex gap-2 mt-2 pr-10">
                                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">{chat.model}</span>
                                    {chat.sentiment === 'positive' && <span className="text-[9px] text-emerald-400">😊 راضي</span>}
                                    {chat.sentiment === 'negative' && <span className="text-[9px] text-red-400">😡 غاضب</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Detail (Main Area) */}
            <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden">

                {selectedChat ? (
                    <div className="w-full h-full flex flex-col">
                        {/* Header */}
                        <div className="h-16 border-b border-white/5 flex justify-between items-center px-6 bg-slate-950/30">
                            <div>
                                <h3 className="font-bold text-white mb-0.5">مراقبة الجلسة: {CHATS.find(c => c.id === selectedChat)?.user}</h3>
                                <p className="text-xs text-slate-400">ID: {selectedChat} • Region: Iraq • IP: 192.168.1.X</p>
                            </div>
                            <button className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500/20 border border-red-500/20 transition-colors">
                                إنهاء الجلسة强制
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            {/* User Msg */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>
                                <div className="bg-slate-800 p-4 rounded-2xl rounded-tr-none text-slate-200 text-sm leading-relaxed max-w-[80%]">
                                    كيف أكتب دالة في بايثون لحساب المتوسط الحسابي لقائمة من الأرقام؟
                                </div>
                            </div>

                            {/* AI Msg */}
                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-cyan-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-cyan-500/20">⚡</div>
                                <div className="bg-cyan-900/20 border border-cyan-500/20 p-4 rounded-2xl rounded-tl-none text-slate-100 text-sm leading-relaxed max-w-[90%] shadow-lg shadow-cyan-900/10">
                                    <p className="mb-2">أهلاً بك! يمكنك استخدام دالة <code>sum()</code> و <code>len()</code> بهذا الشكل البسيط:</p>
                                    <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto" dir="ltr">
                                        {`def calculate_average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

# تجربة الكود
my_list = [10, 20, 30, 40]
print(calculate_average(my_list))  # النتيجة: 25.0`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Inspector Panel */}
                        <div className="h-48 border-t border-white/5 bg-slate-950/50 p-4 grid grid-cols-3 gap-4 text-xs font-mono">
                            <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                                <h4 className="text-slate-400 mb-2">Prompt Engineering</h4>
                                <div className="text-emerald-400">System: strict_coder_v2</div>
                                <div className="text-slate-500 mt-1">Temperature: 0.7</div>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                                <h4 className="text-slate-400 mb-2">Token Usage</h4>
                                <div className="flex justify-between mb-1"><span>Input:</span> <span className="text-white">45</span></div>
                                <div className="flex justify-between"><span>Output:</span> <span className="text-white">120</span></div>
                            </div>
                            <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                                <h4 className="text-slate-400 mb-2">Safety Filters</h4>
                                <div className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> PII Check Passed</div>
                                <div className="flex items-center gap-2 text-emerald-400 mt-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Jailbreak Check Passed</div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner border border-white/5">💬</div>
                        <h3 className="text-xl font-bold text-white mb-2">مراقبة المحادثات</h3>
                        <p className="max-w-xs mx-auto text-sm">اختر محادثة من القائمة الجانبية لمراقبة الجلسة في الوقت الفعلي وتحليل الردود.</p>
                    </div>
                )}

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
            </div>
        </div>
    );
}
