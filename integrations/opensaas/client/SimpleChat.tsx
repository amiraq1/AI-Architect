import { askNabd } from 'wasp/client/operations'; // استيراد الجسر
import { useState, useRef } from 'react';

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
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('general'); // الوضع الافتراضي
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAsk = async () => {
        if (!question && !selectedFile) return;
        setLoading(true);

        try {
            // تحضير بيانات الملف إذا وُجد
            let fileData = null;
            if (selectedFile) {
                const base64Content = await convertFileToBase64(selectedFile);
                fileData = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    content: base64Content
                };
            }

            // استدعاء الجسر الذي بنيناه
            const response = await askNabd({
                query: question,
                agentMode: mode,
                modelName: 'llama-3.1-8b-instant', // أو اجعله متغيراً
                attachment: fileData
            });

            setAnswer(response);
            // إعادة تعيين الملف المرفق بعد الإرسال
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (err: any) {
            alert(err.message); // سيظهر هنا "الموديل الذكي متاح للمشتركين فقط"
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10">
            {/* اختيار الخبير */}
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="mb-4 border p-2 rounded">
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

            {/* قسم رفع الملفات */}
            <div className="mt-4 flex items-center gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.txt,.doc,.docx"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors disabled:opacity-50"
                >
                    📎 إرفاق ملف
                </button>

                {/* عرض اسم الملف المحدد */}
                {selectedFile && (
                    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm">
                        <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                        <button
                            onClick={removeFile}
                            className="text-blue-600 hover:text-red-500 font-bold"
                            title="إزالة الملف"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={handleAsk}
                disabled={loading || (!question.trim() && !selectedFile)}
                className="bg-blue-600 text-white px-6 py-2 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
