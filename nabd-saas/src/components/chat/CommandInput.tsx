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
            <div className="relative group bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500/30 transition-all duration-300">

                {/* File Preview Badge */}
                {file && (
                    <div className="absolute -top-10 right-0 animate-fade-in-up">
                        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs shadow-lg">
                            <button onClick={() => setFile(null)} className="hover:text-red-400"><HiX /></button>
                            <span className="truncate max-w-[150px]">{file.name}</span>
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
                        className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
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
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-3 px-3 max-h-[200px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-700"
                        dir="rtl"
                    />

                    <button
                        type="submit"
                        disabled={(!message.trim() && !file) || isLoading}
                        className={`
              p-3 rounded-2xl transition-all duration-300
              ${(!message.trim() && !file) || isLoading
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 hover:scale-105 active:scale-95'
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
                <p className="text-[10px] text-slate-600">
                    نبض يمكن أن يخطئ. يرجى التحقق من المعلومات المهمة.
                </p>
            </div>
        </div>
    );
}
