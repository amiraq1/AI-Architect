'use client';

import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane, HiPaperClip, HiX } from 'react-icons/hi';

interface CommandInputProps {
    onSubmit: (message: string, file: File | null) => void;
    isLoading?: boolean;
}

export function CommandInput({ onSubmit, isLoading }: CommandInputProps) {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
        }
    }, [message]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((message.trim() || file) && !isLoading) {
            onSubmit(message, file);
            setMessage('');
            setFile(null);
            if (textareaRef.current) textareaRef.current.style.height = 'auto'; // Reset height
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-6">
            <div className={`relative group glass-input rounded-3xl transition-all duration-300 ${isLoading ? 'opacity-80' : ''}`}>

                {/* File Preview Badge */}
                {file && (
                    <div className="absolute -top-12 right-0 animate-fade-in-up">
                        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs shadow-lg backdrop-blur-md">
                            <button onClick={() => setFile(null)} className="hover:text-red-400 p-1 rounded-full hover:bg-white/5 transition-colors"><HiX /></button>
                            <span className="truncate max-w-[150px] font-mono">{file.name}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex items-end p-2 sm:p-3">

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-2xl transition-all duration-300"
                        title="Add Attachment"
                    >
                        <HiPaperClip className="w-5 h-5" />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اسأل نبض أي شيء..."
                        rows={1}
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-3 px-3 max-h-[200px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 font-medium"
                        dir="rtl"
                    />

                    <button
                        type="submit"
                        disabled={(!message.trim() && !file) || isLoading}
                        className={`
              p-3 rounded-2xl transition-all duration-300 relative overflow-hidden
              ${(!message.trim() && !file) || isLoading
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95'
                            }
            `}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <HiPaperAirplane className="w-5 h-5 rotate-180 rtl:-rotate-90" />
                        )}
                    </button>

                </form>
            </div>

            <div className="text-center mt-3">
                <p className="text-[10px] text-slate-600 animate-pulse-slow">
                    نبض يمكن أن يخطئ. يرجى التحقق من المعلومات المهمة.
                </p>
            </div>
        </div>
    );
}
