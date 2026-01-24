'use client';
import { HiSearch, HiBookOpen, HiLightningBolt, HiPencil, HiCheck, HiX } from 'react-icons/hi';
import { ChatEvent } from '@/types/chat';

const ICONS = {
    search: HiSearch,
    read: HiBookOpen,
    think: HiLightningBolt,
    write: HiPencil,
    tool_call: HiLightningBolt,
};

export function ChatEventTimeline({ events }: { events?: ChatEvent[] }) {
    if (!events || events.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 mb-4 animate-fade-in-up w-full max-w-2xl">
            {events.map((event, index) => {
                const Icon = ICONS[event.type] || HiLightningBolt;
                const isLast = index === events.length - 1;
                const isLoading = event.status === 'loading';

                return (
                    <div
                        key={event.id}
                        className={`
                            flex items-center gap-3 p-2 rounded-lg text-sm border transition-all duration-300
                            ${event.status === 'done' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' : ''}
                            ${event.status === 'error' ? 'text-red-400 bg-red-500/5 border-red-500/10' : ''}
                            ${event.status === 'loading' ? 'text-blue-400 bg-blue-500/5 border-blue-500/10' : ''}
                        `}
                    >
                        {/* Icon Container */}
                        <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${event.status === 'done' ? 'bg-emerald-500/20' : ''}
                            ${event.status === 'loading' ? 'bg-blue-500/20' : ''}
                            ${event.status === 'error' ? 'bg-red-500/20' : ''}
                        `}>
                            {isLoading ? (
                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            ) : event.status === 'done' ? (
                                <HiCheck className="w-4 h-4" />
                            ) : event.status === 'error' ? (
                                <HiX className="w-4 h-4" />
                            ) : (
                                <Icon className="w-4 h-4" />
                            )}
                        </div>

                        {/* Label */}
                        <span className="font-medium flex-1">
                            {event.label}
                        </span>

                        {/* Loading Pulse */}
                        {isLoading && (
                            <span className="flex items-center gap-0.5 px-2">
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
