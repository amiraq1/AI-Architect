import { useState, useRef } from 'react';
import { HiPaperAirplane, HiPaperClip, HiX, HiDocumentText, HiPhotograph } from 'react-icons/hi';

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
        <div className="w-full max-w-4xl mx-auto">

            {/* File Preview */}
            {selectedFile && (
                <div className="mb-2 flex justify-end px-2 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-sm shadow-lg">
                        <button
                            onClick={removeFile}
                            className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-slate-700"
                        >
                            <HiX className="h-4 w-4" />
                        </button>
                        <span className="truncate max-w-[200px]" dir="ltr">{selectedFile.name}</span>
                        {selectedFile.type.startsWith('image/') ? (
                            <HiPhotograph className="h-5 w-5 text-purple-400" />
                        ) : (
                            <HiDocumentText className="h-5 w-5 text-cyan-400" />
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative group">

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.txt,.doc,.docx"
                />

                <input
                    type="text"
                    className="block w-full px-12 py-3.5 bg-slate-900 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm sm:text-base text-right font-sans shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="اكتب رسالتك هنا..."
                    dir="rtl"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                />

                {/* Attachment Button (Right) */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
                    title="إرفاق ملف"
                >
                    <HiPaperClip className="h-5 w-5" />
                </button>

                {/* Send Button (Left) */}
                <button
                    type="submit"
                    disabled={isLoading || (!message.trim() && !selectedFile)}
                    className="absolute inset-y-0 left-3 flex items-center px-1 text-cyan-500 hover:text-cyan-400 disabled:text-slate-600 transition-colors disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        // Rotating icon for RTL (pointing left)
                        <HiPaperAirplane className="h-5 w-5 rotate-180" />
                    )}
                </button>
            </form>
        </div>
    );
}
