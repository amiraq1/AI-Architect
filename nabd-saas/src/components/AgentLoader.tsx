'use client';

import { useState, useEffect } from 'react';
import { HiSparkles, HiSearch, HiLightningBolt, HiPencil } from 'react-icons/hi';

// قائمة الحالات التي يمر بها الوكيل
const LOADING_STATES = [
    { text: 'يفكر في طلبك...', icon: HiSparkles, color: 'text-purple-400' },
    { text: 'يبحث في المصادر...', icon: HiSearch, color: 'text-blue-400' },
    { text: 'يحلل البيانات...', icon: HiLightningBolt, color: 'text-yellow-400' },
    { text: 'يصيغ الإجابة النهائية...', icon: HiPencil, color: 'text-green-400' },
];

export default function AgentLoader() {
    const [currentState, setCurrentState] = useState(0);

    useEffect(() => {
        // تغيير الحالة كل 2.5 ثانية
        const interval = setInterval(() => {
            setCurrentState((prev) => (prev + 1) % LOADING_STATES.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const StateIcon = LOADING_STATES[currentState].icon;

    return (
        <div
            className="flex items-center gap-3 p-3 max-w-sm mx-auto bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700 shadow-lg my-4"
            dir="rtl"
        >
            {/* أيقونة الحالة المتغيرة */}
            <div className={`p-2 rounded-full bg-slate-900/50 ${LOADING_STATES[currentState].color} transition-colors duration-300`}>
                <StateIcon className="w-5 h-5 animate-bounce" />
            </div>

            {/* النص */}
            <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-slate-200 transition-all duration-300">
                    {LOADING_STATES[currentState].text}
                </span>
                <span className="text-[10px] text-slate-500">نبض AI يعمل</span>
            </div>

            {/* شعار نبض صغير (Logo) - نقاط متحركة */}
            <div className="flex items-center gap-1 pr-3 border-r border-slate-700">
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce" />
            </div>
        </div>
    );
}
