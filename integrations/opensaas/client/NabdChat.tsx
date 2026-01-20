/**
 * Nabd AI Chat Component for OpenSaaS
 * Copy this file to: src/client/app/NabdChat.tsx
 * 
 * Usage:
 * ```tsx
 * import { NabdChat } from './NabdChat';
 * <NabdChat />
 * ```
 */

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { generateNabdResponse } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type AgentMode = 'general' | 'coder' | 'writer' | 'researcher';
type ModelName = 'llama-3.1-8b-instant' | 'llama-3.3-70b-versatile';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'error';
    content: string;
    plan?: string[];
    stepsExecuted?: number;
    timestamp: Date;
}

interface AgentOption {
    id: AgentMode;
    name: string;
    nameAr: string;
    icon: string;
    description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const AGENT_OPTIONS: AgentOption[] = [
    {
        id: 'general',
        name: 'General Assistant',
        nameAr: 'مساعد عام',
        icon: '🤖',
        description: 'For general tasks and questions',
    },
    {
        id: 'coder',
        name: 'Programmer',
        nameAr: 'مبرمج',
        icon: '👨‍💻',
        description: 'Code writing and analysis',
    },
    {
        id: 'writer',
        name: 'Content Writer',
        nameAr: 'كاتب محتوى',
        icon: '📝',
        description: 'Creative and professional writing',
    },
    {
        id: 'researcher',
        name: 'Researcher',
        nameAr: 'باحث',
        icon: '🔍',
        description: 'Deep research with reliable sources',
    },
];

const MODEL_OPTIONS = [
    { id: 'llama-3.1-8b-instant' as ModelName, name: 'Fast', icon: '🚀' },
    { id: 'llama-3.3-70b-versatile' as ModelName, name: 'Smart', icon: '🧠' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function NabdChat() {
    const { data: user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agentMode, setAgentMode] = useState<AgentMode>('general');
    const [modelName, setModelName] = useState<ModelName>('llama-3.1-8b-instant');
    const [showSettings, setShowSettings] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await generateNabdResponse({
                prompt: userMessage.content,
                agentMode,
                modelName,
            });

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: response.result,
                plan: response.plan,
                stepsExecuted: response.steps_executed,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: 'error',
                content: error.message || 'An unexpected error occurred',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedAgent = AGENT_OPTIONS.find((a) => a.id === agentMode)!;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                        ن
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Nabd AI
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedAgent.icon} {selectedAgent.name}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-4 animate-in slide-in-from-top">
                    {/* Agent Mode Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Agent Mode
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {AGENT_OPTIONS.map((agent) => (
                                <button
                                    key={agent.id}
                                    onClick={() => setAgentMode(agent.id)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${agentMode === agent.id
                                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-cyan-300'
                                        }`}
                                >
                                    <span className="text-2xl">{agent.icon}</span>
                                    <p className="font-medium text-sm mt-1 text-gray-900 dark:text-white">
                                        {agent.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {agent.nameAr}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Model Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Model
                        </label>
                        <div className="flex gap-2">
                            {MODEL_OPTIONS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setModelName(model.id)}
                                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${modelName === model.id
                                            ? model.id.includes('8b')
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                                : 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-xl">{model.icon}</span>
                                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                        {model.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                            <span className="text-4xl">🤖</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Welcome to Nabd AI
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            I'm an autonomous AI agent. I plan, execute, review, and deliver results.
                            Ask me anything!
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-cyan-500 text-white'
                                    : message.role === 'error'
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                }`}
                        >
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                {message.content}
                            </div>
                            {message.plan && message.plan.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        Executed Plan ({message.stepsExecuted} steps):
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {message.plan.map((step, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300"
                                            >
                                                {step}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Nabd is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NabdChat;
