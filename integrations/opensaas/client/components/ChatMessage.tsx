import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ⚠️ هام: ضع رابط مشروع نبض الخاص بك هنا
const NABD_BACKEND_URL = 'https://YOUR-REPL-NAME.replit.app';

interface ChatMessageProps {
    content: string;
    role: 'user' | 'assistant';
}

export function ChatMessage({ content, role }: ChatMessageProps) {
    const isUser = role === 'user';

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm overflow-hidden ${isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap">{content}</p>
                ) : (
                    // 👇 منطقة عرض المساعد باستخدام Markdown
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // 🖼️ معالج الصور الجديد
                            img: ({ src, alt, ...props }: any) => {
                                let finalSrc = src;
                                // إصلاح روابط الصور النسبية
                                if (src?.startsWith('/static')) {
                                    finalSrc = `${NABD_BACKEND_URL}${src}`;
                                }
                                return (
                                    <img
                                        src={finalSrc}
                                        alt={alt}
                                        className="rounded-xl shadow-md max-w-full h-auto my-4 border"
                                        {...props}
                                    />
                                );
                            },
                            // 💻 معالج الأكواد (كما هو سابقاً)
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <div className="rounded-md overflow-hidden my-2 shadow-sm">
                                        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className="bg-gray-100 text-red-500 rounded px-1 text-sm font-mono" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            // تنسيقات النصوص الروابط
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-blue-500 underline">{children}</a>,
                            ul: ({ children }) => <ul className="list-disc list-inside ml-2 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside ml-2 mb-2">{children}</ol>,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    );
}
