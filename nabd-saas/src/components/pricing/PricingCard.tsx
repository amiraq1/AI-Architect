import { HiCheck } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';

interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingCardProps {
    title: string;
    price: string;
    period?: string;
    description: string;
    features: PricingFeature[];
    isPopular?: boolean;
    ctaText: string;
    ctaVariant?: 'primary' | 'secondary' | 'glow' | 'ghost';
    onCtaClick?: () => void;
}

export function PricingCard({
    title,
    price,
    period = '/ شهرياً',
    description,
    features,
    isPopular = false,
    ctaText,
    ctaVariant = 'secondary',
    onCtaClick
}: PricingCardProps) {
    return (
        <div className={`
      relative p-8 rounded-3xl border transition-all duration-500 group
      ${isPopular
                ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900 border-cyan-500/50 shadow-2xl shadow-cyan-900/20 scale-105 z-10'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
            }
    `}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/40 tracking-wide animate-pulse-slow">
                    الأكثر طلباً
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-200'}`}>
                    {title}
                </h3>
                <p className="text-slate-400 text-sm min-h-[40px]">
                    {description}
                </p>
            </div>

            {/* Price */}
            <div className="mb-8 flex items-end gap-1">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    {price}
                </span>
                <span className="text-slate-500 text-sm font-medium mb-1.5">
                    {period}
                </span>
            </div>

            {/* CTA */}
            <div className="mb-8">
                <Button
                    variant={ctaVariant}
                    className={`w-full ${isPopular ? 'shadow-cyan-500/20' : ''}`}
                    onClick={onCtaClick}
                    href={onCtaClick ? undefined : '/login'}
                >
                    {ctaText}
                </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className={`
              mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-none
              ${feature.included
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'bg-slate-800/50 text-slate-600'
                            }
            `}>
                            <HiCheck className="w-3 h-3" />
                        </div>
                        <span className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-600 line-through decoration-slate-700'}`}>
                            {feature.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
