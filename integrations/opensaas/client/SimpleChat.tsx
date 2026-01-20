import { askNabd } from 'wasp/client/operations'; // استيراد الجسر
import { useState } from 'react';

export default function ChatPage() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('general'); // الوضع الافتراضي

    const handleAsk = async () => {
        if (!question) return;
        setLoading(true);
        try {
            // هنا نستدعي الجسر الذي بنيناه
            const response = await askNabd({
                query: question,
                agentMode: mode,
                modelName: 'llama-3.1-8b-instant' // أو اجعله متغيراً
            });
            setAnswer(response);
        } catch (err: any) {
            alert(err.message); // سيظهر هنا "الموديل الذكي متاح للمشتركين فقط"
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10">
            {/* اختيار الخبير */}
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="mb-4 border p-2">
                <option value="general">مساعد عام</option>
                <option value="coder">مبرمج</option>
                <option value="writer">كاتب</option>
            </select>

            {/* صندوق الإدخال */}
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border p-4 rounded"
                placeholder="اسأل نبض..."
            />

            <button
                onClick={handleAsk}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded mt-2"
            >
                {loading ? 'جاري التفكير...' : 'إرسال 🚀'}
            </button>

            {/* عرض الإجابة */}
            {answer && (
                <div className="mt-6 p-4 bg-gray-100 rounded markdown-body">
                    {answer}
                </div>
            )}
        </div>
    );
}
