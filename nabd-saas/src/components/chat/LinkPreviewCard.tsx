'use client';
import { useState, useEffect } from 'react';

export function LinkPreviewCard({ url }: { url: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchPreview = async () => {
            try {
                const res = await fetch('/api/preview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                if (!res.ok) throw new Error();
                const json = await res.json();
                if (mounted && json.title) setData(json);
                else throw new Error();
            } catch {
                if (mounted) setError(true);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchPreview();
        return () => { mounted = false; };
    }, [url]);

    if (error || (!loading && !data)) return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 break-all"
        >
            {url}
        </a>
    );

    if (loading) return (
        <div className="flex w-full max-w-md h-24 bg-slate-800/50 rounded-xl border border-white/5 animate-pulse my-2 overflow-hidden">
            <div className="w-24 bg-slate-700/50 h-full" />
            <div className="p-3 flex-1 flex flex-col gap-2">
                <div className="h-4 bg-slate-700/50 w-3/4 rounded" />
                <div className="h-3 bg-slate-700/50 w-1/2 rounded" />
            </div>
        </div>
    );

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-md my-3 group no-underline"
            dir="ltr" // Force LTR for URL content usually
        >
            <div className="flex bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:bg-slate-800 hover:border-cyan-500/30 transition-all duration-300 shadow-lg">
                {data.image && (
                    <div className="w-28 h-auto relative bg-slate-950 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                )}
                <div className="p-3 flex flex-col justify-center min-w-0 flex-1">
                    <h3 className="font-bold text-slate-200 text-sm truncate group-hover:text-cyan-400 transition-colors" title={data.title}>
                        {data.title}
                    </h3>
                    {data.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {data.description}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`}
                            alt="favicon"
                            className="w-3 h-3 opacity-70"
                        />
                        <span className="text-[10px] text-slate-500 font-mono truncate">
                            {new URL(url).hostname}
                        </span>
                    </div>
                </div>
            </div>
        </a>
    );
}
