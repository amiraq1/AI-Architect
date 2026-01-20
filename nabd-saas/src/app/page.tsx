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

const QUICK_ACTIONS = [
  'ما هي آخر أخبار التكنولوجيا؟',
  'اكتب لي كود بايثون',
  'لخص هذا المقال',
  'تحليل بيانات السوق'
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
    // استخدام dvh (dynamic viewport height) لحل مشاكل شريط المتصفح في الهواتف
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-100 font-sans" dir="rtl">

      {/* الخلفية المتحركة - مخففة للهواتف */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header - Compact for Mobile */}
      <header className="relative z-10 flex-none bg-slate-900/80 backdrop-blur-xl border-b border-white/5 safe-top-padding">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20 text-white font-bold transition-transform group-active:scale-95">
                ن
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white leading-tight">نبض AI</h1>
              <span className="text-xs text-cyan-400 font-medium">
                {selectedAgent.name} • {selectedAgent.icon}
              </span>
            </div>
          </div>

          {/* Model Toggle - Simplified for tactile feel */}
          <button
            onClick={() => setModelName(prev => prev.includes('8b') ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant')}
            className={`
              relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all border
              ${modelName.includes('70b')
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'}
            `}
          >
            {modelName.includes('70b') ? 'ذكي 🧠' : 'سريع 🚀'}
          </button>
        </div>

        {/* Agent Selector - Horizontal Scroll for Mobile */}
        <div className="w-full overflow-x-auto no-scrollbar border-t border-white/5 py-2">
          <div className="flex px-4 gap-2 min-w-max mx-auto max-w-4xl">
            {AGENT_MODES.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setAgentMode(agent.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 touch-manipulation ${agentMode === agent.id
                    ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <span className="text-lg">{agent.icon}</span>
                <span>{agent.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Messages Area - Flex Grow */}
      <main className="relative z-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50dvh] text-center px-4 animate-in fade-in duration-700 slide-in-from-bottom-4">
            <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center border border-white/5 shadow-2xl">
              <span className="text-4xl filter drop-shadow-lg">{selectedAgent.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">مرحباً بك في نبض</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed mb-8">
              الذكاء الاصطناعي العربي المتقدم. خطط، نفذ، وأنجز مهامك بسرعة فائقة.
            </p>

            {/* Quick Actions - Grid for better mobile layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {QUICK_ACTIONS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  className="p-3 text-right text-sm bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-300 transition-all active:scale-98 touch-manipulation"
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
            className={`flex w-full animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-start' : 'justify-end'
              }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-md text-sm sm:text-base leading-relaxed break-words ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none'
                  : msg.role === 'error'
                    ? 'bg-red-500/10 text-red-200 border border-red-500/20'
                    : 'bg-slate-800/80 backdrop-blur-sm text-slate-100 border border-white/5 rounded-tl-none'
                }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.plan && msg.plan.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">خطوات التنفيذ</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.plan.map((step, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-cyan-200 border border-white/5">
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
          <div className="flex justify-end w-full animate-pulse">
            <div className="bg-slate-800/50 rounded-2xl rounded-tl-none px-4 py-3 border border-white/5">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </main>

      {/* Input Area - Sticky & Safe Area Aware */}
      <footer className="relative z-20 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 p-3 safe-bottom-padding">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              // text-base prevents iOS zoom on focus
              className="w-full pl-4 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-base"
              dir="rtl"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-none w-12 h-12 flex items-center justify-center rounded-2xl bg-cyan-600 text-white disabled:opacity-50 disabled:bg-slate-800 transition-all active:scale-95 touch-manipulation shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}
