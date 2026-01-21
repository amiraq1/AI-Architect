import { useState, useRef } from 'react';

interface ChatInputProps {
    onSubmit: (message: string, file: File | null) => void;
    isLoading?: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((message.trim() || selectedFile) && !isLoading) {
            onSubmit(message, selectedFile);
            setMessage('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full border-t bg-white p-4">
            {/* File Preview */}
            {selectedFile && (
                <div className="mb-3 flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm">
                    <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                    {selectedFile.type.startsWith('image/') && (
                        <span className="text-blue-500">📷</span>
                    )}
                    <button
                        onClick={removeFile}
                        className="ml-auto text-blue-500 hover:text-red-500 font-bold"
                        title="إزالة الملف"
                    >
                        ✕
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.txt,.doc,.docx"
                />

                {/* Attachment Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    title="إرفاق ملف"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>

                {/* Text Input */}
                <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="اكتب رسالتك هنا..."
                    dir="rtl"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={isLoading || (!message.trim() && !selectedFile)}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}
