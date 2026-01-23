import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glow' | 'ghost';
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

    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30",
        secondary: "bg-slate-800/50 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600",
        glow: "bg-white text-slate-900 hover:bg-cyan-50 shadow-lg shadow-white/10 hover:shadow-cyan-400/20",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-5 py-2.5",
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
