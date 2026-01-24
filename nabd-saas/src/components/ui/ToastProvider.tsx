'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HiCheck, HiExclamation, HiX, HiInformationCircle } from 'react-icons/hi';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

const ToastContext = createContext<{ showToast: (msg: string, type?: ToastType) => void }>({
    showToast: () => { }
});

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Keyboard accessibility: ESC closes latest toast
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && toasts.length > 0) {
                removeToast(toasts[toasts.length - 1].id);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 left-6 z-[60] flex flex-col gap-3 pointer-events-none" dir="rtl">
                {toasts.map(toast => (
                    <div key={toast.id} className={`
                        pointer-events-auto flex items-center gap-3 px-5 py-4 min-w-[300px] rounded-2xl shadow-2xl border backdrop-blur-xl animate-enter-right
                        transition-all duration-300 transform hover:scale-[1.02] cursor-pointer
                        ${toast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-100 shadow-red-900/20' : ''}
                        ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100 shadow-emerald-900/20' : ''}
                        ${toast.type === 'info' ? 'bg-slate-900/90 border-slate-700/50 text-slate-100 shadow-slate-900/50' : ''}
                    `} onClick={() => removeToast(toast.id)}>

                        <div className={`p-1 rounded-full ${toast.type === 'error' ? 'bg-red-500/20' : toast.type === 'success' ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
                            {toast.type === 'error' && <HiExclamation className="w-5 h-5 text-red-400" />}
                            {toast.type === 'success' && <HiCheck className="w-5 h-5 text-emerald-400" />}
                            {toast.type === 'info' && <HiInformationCircle className="w-5 h-5 text-blue-400" />}
                        </div>

                        <span className="text-sm font-bold flex-1">{toast.message}</span>

                        <button onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }} className="opacity-50 hover:opacity-100 p-1 hover:bg-white/10 rounded-lg transition-colors">
                            <HiX className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
