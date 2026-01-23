import { useRef, useEffect } from 'react';
import MessageContent from '@/components/MessageContent';
import { Message } from '@/types/chat';

interface ChatMessageProps {
    message: Message;
    isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isError = message.role === 'error';

    return (
        <div className={`flex w-full mb-6 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>

            {/* Avatar (Assistant Only) */}
            {!isUser && !isError && (
                <div className="flex-none ml-4 mt-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                        <span className="text-xs">🤖</span>
                    </div>
                </div>
            )}

            {/* Message Body */}
            <div
                className={`
          relative max-w-[85%] sm:max-w-[75%] 
          ${isUser
                        ? 'bg-slate-800 text-slate-100 rounded-2xl rounded-tr-sm '
                        : isError
                            ? 'bg-red-900/10 border border-red-500/20 text-red-200 rounded-2xl'
                            : 'text-slate-300 pl-4' // Assistants get clean text, no bubble
                    }
        `}
            >
                {isUser ? (
                    <div className="px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {message.attachment && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 text-cyan-200">
                                <span className="text-sm">📎</span>
                                <span className="text-xs opacity-80">{message.attachment.name}</span>
                            </div>
                        )}
                        {message.content}
                    </div>
                ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                        {/* If it's an assistant, we use the Markdown renderer directly on the "clean" background */}
                        <MessageContent content={message.content} />

                        {/* Plans / Thoughts */}
                        {message.plan && message.plan.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-slate-800/50">
                                <div className="text-xs font-bold text-slate-500 mb-2">خطوات التفكير:</div>
                                <div className="flex flex-wrap gap-2">
                                    {message.plan.map((step, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 rounded border border-slate-800 bg-slate-900/50 text-slate-400">
                                            {i + 1}. {step}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
