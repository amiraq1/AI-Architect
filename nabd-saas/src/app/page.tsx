'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const AGENT_MODES = [
  { id: 'general', name: 'مساعد عام', icon: '🤖' },
  { id: 'coder', name: 'مبرمج', icon: '👨‍💻' },
  { id: 'writer', name: 'كاتب', icon: '📝' },
  { id: 'researcher', name: 'باحث', icon: '🔍' },
];

const MODEL_OPTIONS = [
  { id: 'llama-3.1-8b-instant', name: 'سريع 🚀' },
  { id: 'llama-3.3-70b-versatile', name: 'ذكي 🧠' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  plan?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentMode, setAgentMode] = useState('general');
  const [modelName, setModelName] = useState('llama-3.1-8b-instant');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/nabd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.content,
          agentMode,
          modelName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.result || data.response || JSON.stringify(data),
          plan: data.plan,
        },
      ]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'error',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAgent = AGENT_MODES.find((a) => a.id === agentMode)!;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 font-bold text-white">
              ن
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">نبض AI</h1>
            <p className="text-sm text-slate-400 flex items-center gap-1">
              <span>{selectedAgent.icon}</span>
              <span>{selectedAgent.name}</span>
            </p>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex gap-2">
          {MODEL_OPTIONS.map((model) => (
            <button
              key={model.id}
              onClick={() => setModelName(model.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${modelName === model.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </header>

      {/* Agent Mode Selector */}
      <div className="flex justify-center gap-2 p-4 border-b border-slate-700/30">
        {AGENT_MODES.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setAgentMode(agent.id)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${agentMode === agent.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-800/30 text-slate-400 border border-transparent hover:bg-slate-800/50'
              }`}
          >
            <span className="text-lg">{agent.icon}</span>
            <span className="text-sm font-medium">{agent.name}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
              <span className="text-5xl">{selectedAgent.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">مرحباً بك في نبض</h2>
            <p className="text-slate-400 max-w-md">
              أنا وكيل ذكاء اصطناعي مستقل. أخطط، أنفذ، وأقدم لك النتائج.
              <br />اسألني أي شيء!
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {['ما هي آخر أخبار التكنولوجيا؟', 'اكتب لي كود بايثون', 'لخص هذا المقال'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 text-sm border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user'
                  ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                  : msg.role === 'error'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
                }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 text-cyan-400 text-sm">
                  <span>{selectedAgent.icon}</span>
                  <span className="font-medium">نبض</span>
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              {msg.plan && msg.plan.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <p className="text-xs text-slate-500 mb-2">الخطة المنفذة:</p>
                  <div className="flex flex-wrap gap-1">
                    {msg.plan.map((step, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
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
          <div className="flex justify-end">
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">نبض يفكر...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700/50 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            disabled={isLoading}
            className="flex-1 px-5 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
          >
            <span>إرسال</span>
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
