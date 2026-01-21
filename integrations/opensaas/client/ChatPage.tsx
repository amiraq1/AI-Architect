import { useQuery } from 'wasp/client/operations';
import { getChatHistory, sendChatMessage } from 'wasp/client/operations';
import ChatInput from '../components/ChatInput';
import { useState, useEffect, useRef } from 'react';

// دالة مساعدة لتحويل الملف إلى Base64
const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export default function ChatPage() {
    // جلب الرسائل من السيرفر
    const { data: history, isLoading: isHistoryLoading } = useQuery(getChatHistory);

    // State محلي لإدارة الرسائل وعرضها فوراً
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // عند تحميل البيانات من السيرفر، نحدث الـ State
    useEffect(() => {
        if (history && Array.isArray(history)) {
            setMessages(history);
        }
    }, [history]);

    // التمرير التلقائي لأسفل عند تحديث الرسائل
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text: string, file: File | null) => {
        // تحديث تفاؤلي (Optimistic Update) - إظهار الرسالة قبل وصول الرد
        const tempUserMsg = { role: 'user', content: text, hasImage: !!file };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            let attachmentData = null;
            if (file) {
                const base64 = await convertFileToBase64(file);
                attachmentData = {
                    name: file.name,
                    type: file.type,
                    content: base64
                };
            }

            const result = await sendChatMessage({
                message: text,
                attachment: attachmentData
            });

            // إضافة رد الـ AI
            setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
        } catch (err) {
            console.error(err);
            alert("عذراً، حدث خطأ أثناء الاتصال");
        }
    };

    if (isHistoryLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-gray-500 animate-pulse">جاري تحميل ذاكرة نبض...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                        <span className="text-4xl mb-2">✨</span>
                        <p>ابدأ محادثة جديدة مع نبض</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`
                 p-3 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-sm relative
                 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
             `}>
                            {msg.hasImage && (
                                <div className="text-xs mb-2 flex items-center gap-1 opacity-80 bg-black/10 p-1 rounded w-fit">
                                    <span>📷</span>
                                    <span>صورة مرفقة</span>
                                </div>
                            )}
                            <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base" dir="auto">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSubmit={handleSendMessage} />
        </div>
    );
}
