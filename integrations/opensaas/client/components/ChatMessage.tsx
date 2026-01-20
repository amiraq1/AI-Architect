import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
                {/* إذا كان المستخدم، اعرض النص فقط. إذا كان المساعد، استخدم Markdown */}
                {isUser ? (
                    <p className="whitespace-pre-wrap">{content}</p>
                ) : (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // تخصيص عرض الأكواد البرمجية
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <div className="rounded-md overflow-hidden my-2" dir="ltr">
                                        {/* شريط العنوان للكود */}
                                        <div className="bg-gray-800 text-gray-400 text-xs px-3 py-1 flex justify-between items-center">
                                            <span>{match[1]}</span>
                                            {/* Placeholder for Copy functionality */}
                                            <span className="cursor-pointer hover:text-white">Copy</span>
                                        </div>
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className="bg-gray-100 text-red-500 rounded px-1 py-0.5 text-sm font-mono" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            // تخصيص العناصر الأخرى
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                            h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-md font-bold mb-1 mt-2">{children}</h3>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2 text-gray-600">{children}</blockquote>,
                            a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    );
}
