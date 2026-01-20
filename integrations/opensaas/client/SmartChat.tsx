import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useAction, getChatHistory, askNabd } from 'wasp/client/operations';
import { ChatMessage } from './components/ChatMessage'; // استيراد مكون الرسالة المتطور

export default function SmartChatPage() {
    // 1. جلب تاريخ المحادثة تلقائياً
    const { data: history, isLoading, refetch } = useQuery(getChatHistory);

    // 2. إدارة الرسالة الجديدة
    const askNabdAction = useAction(askNabd);
    const [input, setInput] = useState('');

    // مرجع للنزول لأسفل الشات تلقائياً
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // كلما زادت الرسائل، انزل للأسفل
    useEffect(scrollToBottom, [history]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput(''); // مسح الحقل فوراً (UX جيد)

        try {
            // إرسال للسيرفر
            await askNabdAction.execute({
                query: userMessage,
                agentMode: 'general',
                modelName: 'smart'
            });

            // تحديث القائمة فوراً
            refetch();
        } catch (error: any) {
            alert("حدث خطأ: " + error.message);
        }
    };

    if (isLoading) return <div className="p-10 text-center">جاري تحميل ذكرياتك... ⏳</div>;

    return (
        <div className="flex flex-col h-[85vh] max-w-4xl mx-auto border rounded-lg shadow-lg bg-white overflow-hidden my-6">

            {/* 🟢 منطقة عرض الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {history?.map((msg: any) => (
                    <ChatMessage
                        key={msg.id}
                        content={msg.content}
                        role={msg.role}
                    />
                ))}
                {/* عنصر مخفي للنزول إليه */}
                <div ref={messagesEndRef} />
            </div>

            {/* 🔵 منطقة الكتابة */}
            <div className="p-4 bg-white border-t flex gap-2 items-center">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="اكتب رسالتك لنبض..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={askNabdAction.isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={askNabdAction.isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 shadow-md"
                >
                    {askNabdAction.isLoading ? '⏳' : '🚀'}
                </button>
            </div>
        </div>
    );
}
