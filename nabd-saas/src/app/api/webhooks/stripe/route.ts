import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// NOTE: لا ننشئ "stripe" هنا عند مستوى الموديول.
// سننشئه داخل الـ handler بعد التحقق من وجود المتغيرات.

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/** Helper: create Stripe client lazily with a real secret */
function createStripeClient(): Stripe {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        // لا ننشئ العميل بدون مفتاح صالح — هذا يمنع فشل البناء
        throw new Error('STRIPE_SECRET_KEY not configured');
    }
    return new Stripe(key, {
        apiVersion: '2024-12-18.acacia' as any, // Suppress version mismatch lint
        typescript: true,
    });
}

export async function POST(req: NextRequest) {
    // تحقق مبكراً من متغيرات البيئة المطلوبة
    if (!WEBHOOK_SECRET) {
        console.error('Stripe webhook secret missing (STRIPE_WEBHOOK_SECRET)');
        return NextResponse.json({ error: 'Stripe config missing' }, { status: 500 });
    }

    // حاول إنشاء عميل Stripe الآن (عند وقت الطلب)
    let stripe: Stripe;
    try {
        stripe = createStripeClient();
    } catch (err: any) {
        console.error('[Stripe] Initialization error:', err?.message || err);
        return NextResponse.json({ error: 'Stripe config missing' }, { status: 500 });
    }

    try {
        const body = await req.text();
        const signature = (await headers()).get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        // 🛡️ Verify the event came consistently from Stripe
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
        } catch (err: any) {
            console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log(`[Stripe Webhook] Processing event: ${event.type}`);

        // Handle events the same way as before
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userEmail = session.customer_email;
                const subscriptionId = session.subscription as string;

                console.log(`✅ Payment success for: ${userEmail}. Sub ID: ${subscriptionId}`);
                // TODO: update DB...
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`❌ Subscription canceled: ${subscription.id}`);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                console.warn(`⚠️ Payment failed for invoice: ${invoice.id}, User: ${invoice.customer_email}`);
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('[Webhook Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
