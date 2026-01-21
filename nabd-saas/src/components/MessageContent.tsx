'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { HiClipboard, HiCheck } from 'react-icons/hi';

// مكون خاص لعرض بلوك الكود مع زر النسخ
const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeText = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (!inline && match) {
        return (
            <div className="relative my-4 rounded-lg overflow-hidden text-left group" dir="ltr">
                {/* شريط العنوان للكود */}
                <div className="flex items-center justify-between bg-slate-800 px-4 py-2 text-xs text-slate-300 border-b border-slate-700">
                    <span className="font-mono text-cyan-400">{match[1]}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
                    >
                        {isCopied ? (
                            <>
                                <HiCheck className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">تم النسخ</span>
                            </>
                        ) : (
                            <>
                                <HiClipboard className="w-4 h-4" />
                                <span>نسخ</span>
                            </>
                        )}
                    </button>
                </div>

                {/* محتوى الكود */}
                <div className="bg-[#282c34] p-4 overflow-x-auto">
                    <code className={className} {...props}>
                        {children}
                    </code>
                </div>
            </div>
        );
    }

    // للأكواد الصغيرة داخل السطر (inline code)
    return (
        <code
            className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm"
            dir="ltr"
            {...props}
        >
            {children}
        </code>
    );
};

interface MessageContentProps {
    content: string;
    className?: string;
}

export default function MessageContent({ content, className = '' }: MessageContentProps) {
    return (
        <div
            className={`
        prose prose-invert prose-sm sm:prose max-w-none text-right
        prose-p:text-slate-200 prose-p:leading-relaxed
        prose-headings:text-cyan-400 prose-headings:font-bold
        prose-strong:text-white
        prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-r-cyan-500 prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:bg-slate-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-l-lg prose-blockquote:text-slate-300
        prose-hr:border-slate-700
        ${className}
      `}
            dir="rtl"
        >
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code: CodeBlock,
                    a: ({ node, ...props }) => (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            {...props}
                        />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside space-y-1 pr-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside space-y-1 pr-2" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
