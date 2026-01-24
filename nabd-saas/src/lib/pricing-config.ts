/**
 * 💰 Payment & Pricing Configuration
 * Central source of truth for all billing logic.
 * NEVER trust client-side prices. Always retrieve from here.
 */

export const CURRENCY = 'iqd';

export const PLANS = {
    free: {
        id: 'free',
        name: 'البداية',
        price: 0,
        stripeId: null, // Free plan has no Stripe ID
        features: ['limit_50_msg', 'model_8b'],
        quota: {
            tokens: 50000,
            requests: 50
        }
    },
    pro: {
        id: 'pro',
        name: 'مُحترف',
        price: 15000,
        // TODO: Replace with real Stripe Price ID from Dashboard
        stripeId: 'price_REPLACE_WITH_REAL_ID_PRO',
        features: ['unlimited_msg', 'model_70b', 'file_analysis'],
        quota: {
            tokens: 1000000, // 1M tokens
            requests: -1 // Unlimited
        }
    },
    business: {
        id: 'business',
        name: 'أعمال',
        price: 40000,
        // TODO: Replace with real Stripe Price ID from Dashboard
        stripeId: 'price_REPLACE_WITH_REAL_ID_BIZ',
        features: ['team_access', 'admin_panel', 'priority_support'],
        quota: {
            tokens: 5000000, // 5M tokens
            requests: -1
        }
    }
} as const;

export type PlanId = keyof typeof PLANS;

/**
 * Helper to get plan details by ID safely
 */
export function getPlanConfig(planId: string) {
    return PLANS[planId as PlanId] || PLANS.free;
}
