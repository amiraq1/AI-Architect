import { sendChatMessage } from 'wasp/client/operations'; // استدعاء الأكشن الذي أنشأناه
import ChatInput from '../components/ChatInput'; // المكون الذي عدلناه سابقاً
import { useState } from 'react';

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
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (text: string, file: File | null) => {
        // تحديث الواجهة فوراً برسالة المستخدم
        const newUserMsg = { role: 'user', content: text, hasAttachment: !!file };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

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

            // إرسال الطلب للسيرفر
            const result = await sendChatMessage({
                message: text,
                attachment: attachmentData,
                history: messages.map(m => ({
                    role: m.role,
                    content: m.content
                    // ملاحظة: لا نرسل صور الـ history القديمة لتوفير التكلفة (اختياري)
                }))
            });

            // إضافة رد "نبض"
            setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);

        } catch (err) {
            alert("عذراً، حدث خطأ في الاتصال");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* منطقة عرض الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary-100 mr-auto' : 'bg-white ml-auto'}`}>
                        {msg.hasAttachment && <div className="text-xs text-gray-500 mb-1">[مرفق صورة]</div>}
                        {msg.content}
                    </div>
                ))}
            </div>

            {/* صندوق الإدخال الجديد */}
            <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
        </div>
    );
}
