import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { mode, priceId, priceCents, name, metadata } = body;
        
        if (!mode) {
            return new NextResponse("Missing mode", { status: 400 });
        }

        // 1. Get or create Stripe Customer
        let dbUser = await db.query.users.findFirst({
            where: eq(users.clerkId, user.id)
        });

        // Ensure user exists in DB
        if (!dbUser) {
            const [newUser] = await db.insert(users).values({
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: `${user.firstName} ${user.lastName}`.trim() || "Student",
            }).returning();
            dbUser = newUser;
        }

        let stripeCustomerId = dbUser.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
                name: dbUser.name,
                metadata: {
                    userId: dbUser.id.toString(),
                    clerkId: user.id,
                }
            });
            stripeCustomerId = customer.id;
            
            // Update db user with stripe customer id
            await db.update(users).set({ stripeCustomerId }).where(eq(users.id, dbUser.id));
        }

        // 2. Build Checkout Session parameters
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://musicschool-platform.vercel.app";
        
        let line_items: any[] = [];
        
        if (priceId) {
            // Using a pre-existing Stripe Price ID (for Subscriptions or predefined Services)
            line_items = [
                {
                    price: priceId,
                    quantity: 1,
                }
            ];
        } else if (priceCents && name) {
            // Ad-hoc pricing (for individual masterclasses where price isn't a Stripe Price object yet)
            line_items = [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: name,
                        },
                        unit_amount: priceCents,
                    },
                    quantity: 1,
                }
            ];
        } else {
            return new NextResponse("Missing pricing information", { status: 400 });
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: mode as 'payment' | 'subscription',
            payment_method_types: ['card'],
            line_items,
            success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/student/dashboard?canceled=true`,
            metadata: {
                userId: dbUser.id.toString(),
                ...metadata // Pass through any custom metadata (like classId, planId, serviceId)
            }
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
