'use client';

import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div
            className={`
        prose prose-invert prose-lg max-w-none
        prose-headings:text-cyan-400 prose-headings:font-bold
        prose-p:text-slate-200 prose-p:leading-relaxed
        prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-cyan-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-xl prose-pre:p-0 prose-pre:overflow-hidden
        prose-ul:text-slate-200 prose-ol:text-slate-200
        prose-li:marker:text-cyan-500
        prose-blockquote:border-l-cyan-500 prose-blockquote:text-slate-300 prose-blockquote:bg-slate-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        prose-hr:border-slate-700
        prose-table:border-collapse prose-th:bg-slate-800 prose-th:text-cyan-400 prose-th:p-3 prose-td:p-3 prose-td:border-slate-700
        text-right
        ${className}
      `}
            dir="rtl"
        >
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // تخصيص عرض الكود
                    pre: ({ children, ...props }) => (
                        <pre
                            className="relative group"
                            dir="ltr"
                            {...props}
                        >
                            {children}
                        </pre>
                    ),
                    code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code
                                    className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                                    dir="ltr"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code
                                className={`${className} block p-4 overflow-x-auto text-sm`}
                                dir="ltr"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    // روابط تفتح في تبويب جديد
                    a: ({ children, href, ...props }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            {...props}
                        >
                            {children}
                        </a>
                    ),
                    // تنسيق القوائم
                    ul: ({ children, ...props }) => (
                        <ul className="space-y-2 pr-6" {...props}>
                            {children}
                        </ul>
                    ),
                    ol: ({ children, ...props }) => (
                        <ol className="space-y-2 pr-6" {...props}>
                            {children}
                        </ol>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
