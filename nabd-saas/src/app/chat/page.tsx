'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { CommandInput } from '@/components/chat/CommandInput';
import { SettingsModal } from '@/components/chat/SettingsModal';
import AgentLoader from '@/components/AgentLoader';

const AGENTS = [
    { id: 'general', name: 'عام', icon: '🧠' },
    { id: 'coder', name: 'مبرمج', icon: '💻' },
    { id: 'writer', name: 'كاتب', icon: '✒️' },
    { id: 'academic', name: 'أكاديمي', icon: '🎓' },
];

export default function ChatPage() {
    const { messages, isLoading, sendMessage, clearMessages } = useChat();
    const { settings, updateSettings, isLoaded } = useSettings();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [selectedAgent, setSelectedAgent] = useState('general');
    const [model, setModel] = useState('llama-3.1-8b-instant');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sync model with settings preference when loaded
    useEffect(() => {
        if (isLoaded && settings.chat.defaultModel) {
            setModel(settings.chat.defaultModel);
        }
    }, [isLoaded, settings.chat.defaultModel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className={`flex h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-cyan-500/30 ${settings.general.theme === 'light' ? 'bg-white text-slate-900' : ''}`} dir="rtl">

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentSettings={settings}
                onSave={updateSettings}
            />

            {/* Sidebar */}
            <ChatSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNewChat={clearMessages}
                messagesCount={messages.length}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Main Area */}
            <div className="flex-1 flex flex-col relative min-w-0">

                {/* Header (Glass) */}
                <header className="absolute top-0 w-full z-20 flex items-center justify-between p-4 bg-slate-950/20 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white">
                            <span className="sr-only">Menu</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>

                        {/* Agent Selector (Pill) */}
                        <div className="flex bg-slate-900/50 backdrop-blur-md rounded-full p-1 border border-white/5 shadow-2xl">
                            {AGENTS.map(agent => (
                                <button
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent.id)}
                                    className={`
                        px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2
                        ${selectedAgent === agent.id
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'}
                      `}
                                >
                                    <span>{agent.icon}</span>
                                    <span className="hidden sm:inline">{agent.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Model Toggle */}
                    <button
                        onClick={() => setModel(prev => prev.includes('70b') ? 'llama-3.1-8b-instant' : 'llama-3.3-70b-versatile')}
                        className={`
                px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 backdrop-blur-md
                ${model.includes('70b') ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'}
              `}
                    >
                        <span className={`w-2 h-2 rounded-full ${model.includes('70b') ? 'bg-purple-500' : 'bg-emerald-500'} animate-pulse`}></span>
                        <span>{model.includes('70b') ? 'عبقري (70B)' : 'سريع (8B)'}</span>
                    </button>
                </header>

                {/* Chat Feed */}
                <main className="flex-1 overflow-y-auto px-4 pt-24 pb-4 scroll-smooth">
                    <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center -mt-20 animate-fade-in-up">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center border border-white/5 shadow-2xl mb-6 group">
                                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">👋</span>
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">أهلاً بك في نبض</h1>
                                <p className="text-slate-400 text-center max-w-sm mb-8">
                                    أنا هنا لمساعدتك في البرمجة، الكتابة، البحث، والتحليل. كيف يمكنني مساعدتك؟
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <ChatMessage key={msg.id} message={msg} isLast={i === messages.length - 1} />
                                ))}
                            </>
                        )}

                        {isLoading && (
                            <div className="w-full flex justify-start pb-4 animate-fade-in">
                                <div className="ml-12">
                                    <AgentLoader />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </main>

                {/* Input Area */}
                <footer className="relative z-20">
                    <CommandInput
                        onSubmit={(text, file) => sendMessage(text, file, selectedAgent, model)}
                        isLoading={isLoading}
                    />
                </footer>

            </div>
        </div>
    );
}
