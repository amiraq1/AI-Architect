import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PLANS } from '@/lib/pricing-config';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia', // Use latest API version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    if (!webhookSecret) {
        return NextResponse.json({ error: 'Stripe config missing' }, { status: 500 });
    }

    try {
        const body = await req.text();
        const signature = (await headers()).get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        // 🛡️ SECURITY: Verify the event came consistently from Stripe
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log(`[Stripe Webhook] Processing event: ${event.type}`);

        // 🛡️ LOGIC: Handle specific events
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.CheckoutSession;

                // 1. Extract Info
                const userEmail = session.customer_email;
                const subscriptionId = session.subscription as string;
                /* 
                 * In a real app, 'client_reference_id' usually holds the internal User ID
                 * const userId = session.client_reference_id;
                 */

                console.log(`✅ Payment success for: ${userEmail}. Sub ID: ${subscriptionId}`);

                // 2. TODO: Update Database
                /*
                await db.user.update({
                    where: { email: userEmail },
                    data: { 
                        plan: 'pro', // Logic to map Price ID to Plan ID needed 
                        subscriptionId: subscriptionId,
                        status: 'ACTIVE'
                    }
                });
                */
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`❌ Subscription canceled: ${subscription.id}`);

                // Downgrade user to FREE
                /*
                await db.user.update({
                    where: { subscriptionId: subscription.id },
                    data: { plan: 'free', status: 'CANCELED' }
                });
                */
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                console.warn(`⚠️ Payment failed for invoice: ${invoice.id}, User: ${invoice.customer_email}`);
                // Notify user via email
                break;
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('[Webhook Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
