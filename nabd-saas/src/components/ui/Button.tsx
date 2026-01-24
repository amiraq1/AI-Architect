import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glow' | 'ghost' | 'neon';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    children: React.ReactNode;
    className?: string;
}

export function Button({
    variant = 'primary',
    size = 'md',
    href,
    children,
    className = '',
    ...props
}: ButtonProps) {

    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden";

    const variants = {
        primary: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 border border-white/10",

        // 🌟 New Neon Variant
        neon: "bg-transparent text-white border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-500/10 hover:border-cyan-400 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full hover:before:animate-[shimmer_1.5s_infinite]",

        secondary: "bg-slate-800/50 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-500 backdrop-blur-sm",
        glow: "bg-white text-slate-900 hover:bg-cyan-50 shadow-lg shadow-white/10 hover:shadow-cyan-400/20",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-6 py-3",
        lg: "text-lg px-8 py-4 rounded-2xl",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
}
