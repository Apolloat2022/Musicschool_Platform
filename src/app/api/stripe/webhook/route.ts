import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { 
    users, 
    subscriptions, 
    subscriptionPlans, 
    purchases, 
    services, 
    creditTransactions,
    enrollments,
    musicClasses
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        console.error(`[WEBHOOK_ERROR] Signature verification failed: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata;
                
                if (!metadata?.userId) break;
                const userId = parseInt(metadata.userId);

                // 1. Handle Subscription Checkout
                if (session.mode === "subscription" && metadata.planId) {
                    const planId = parseInt(metadata.planId);
                    
                    // Add subscription record
                    await db.insert(subscriptions).values({
                        userId,
                        planId,
                        stripeSubscriptionId: session.subscription as string,
                        stripeCustomerId: session.customer as string,
                        status: "ACTIVE",
                        creditBalance: 0, // Credits added via invoice.paid webhook
                    });
                } 
                // 2. Handle A La Carte Service Purchase (e.g. Extra Credits)
                else if (session.mode === "payment" && metadata.serviceId) {
                    const serviceId = parseInt(metadata.serviceId);
                    
                    // Record purchase
                    await db.insert(purchases).values({
                        userId,
                        serviceId,
                        stripePaymentIntentId: session.payment_intent as string,
                        status: "COMPLETED",
                        amountPaidCents: session.amount_total || 0,
                    });

                    // Add credits to their active subscription wallet if applicable
                    const service = await db.query.services.findFirst({ where: eq(services.id, serviceId) });
                    if (service && service.creditAmount && service.creditAmount > 0) {
                        const activeSub = await db.query.subscriptions.findFirst({ 
                            where: eq(subscriptions.userId, userId) 
                        });
                        if (activeSub) {
                            await db.update(subscriptions)
                                .set({ creditBalance: (activeSub.creditBalance || 0) + service.creditAmount })
                                .where(eq(subscriptions.id, activeSub.id));
                                
                            await db.insert(creditTransactions).values({
                                subscriptionId: activeSub.id,
                                type: "DEPOSIT",
                                amount: service.creditAmount,
                                note: `A La Carte purchase of ${service.name}`,
                            });
                        }
                    }
                }
                // 3. Handle Direct Class Payment (One-off)
                else if (session.mode === "payment" && metadata.classId) {
                    const classId = parseInt(metadata.classId);
                    const dbUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
                    
                    if (dbUser) {
                        // Direct Enrollment
                        await db.insert(enrollments).values({
                            studentName: dbUser.name,
                            studentEmail: dbUser.email,
                            classId,
                        });
                        // You could also log this to a generic 'payments' table if you had one, 
                        // but enrollments effectively tracks it here.
                    }
                }
                break;
            }

            case "invoice.paid": {
                // This triggers every month the subscription successfully renews (and initially)
                const invoice = event.data.object as any;
                const subscriptionId = invoice.subscription as string;

                if (subscriptionId) {
                    const sub = await db.query.subscriptions.findFirst({
                        where: eq(subscriptions.stripeSubscriptionId, subscriptionId)
                    });

                    if (sub) {
                        const plan = await db.query.subscriptionPlans.findFirst({
                            where: eq(subscriptionPlans.id, sub.planId)
                        });

                        if (plan && plan.creditDeposit && plan.creditDeposit > 0) {
                            // Deposit Monthly Credits
                            await db.update(subscriptions)
                                .set({ 
                                    creditBalance: (sub.creditBalance || 0) + plan.creditDeposit,
                                    currentPeriodStart: new Date(invoice.period_start * 1000),
                                    currentPeriodEnd: new Date(invoice.period_end * 1000)
                                })
                                .where(eq(subscriptions.id, sub.id));

                            await db.insert(creditTransactions).values({
                                subscriptionId: sub.id,
                                type: "DEPOSIT",
                                amount: plan.creditDeposit,
                                note: `Monthly deposit from ${plan.name} renewal`,
                            });
                        }
                    }
                }
                break;
            }

            case "customer.subscription.deleted": {
                // Subscription cancelled/terminated
                const subscription = event.data.object as Stripe.Subscription;
                await db.update(subscriptions)
                    .set({ status: "CANCELED" })
                    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
                break;
            }
        }

        return new NextResponse("Webhook processed successfully", { status: 200 });
    } catch (error: any) {
        console.error("[WEBHOOK_PROCESSING_ERROR]", error);
        return new NextResponse(`Error processing webhook: ${error.message}`, { status: 500 });
    }
}
