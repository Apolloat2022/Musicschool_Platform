import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exitRequests, subscriptions, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { subscriptionId, note } = body;

        if (!subscriptionId) {
            return new NextResponse("Missing subscription ID", { status: 400 });
        }

        const dbUser = await db.query.users.findFirst({
            where: eq(users.clerkId, user.id)
        });

        if (!dbUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        const subscription = await db.query.subscriptions.findFirst({
            where: and(
                eq(subscriptions.id, subscriptionId),
                eq(subscriptions.userId, dbUser.id)
            )
        });

        if (!subscription || !subscription.stripeSubscriptionId) {
            return new NextResponse("Valid subscription not found", { status: 404 });
        }

        // 1. Tell Stripe to cancel at period end
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true
        });

        // 2. Log the Exit Request in DB
        await db.insert(exitRequests).values({
            userId: dbUser.id,
            subscriptionId: subscription.id,
            status: "PENDING",
            note: note || "Requested via Parent Dashboard",
        });

        // 3. Mark the subscription internally as having requested an exit
        await db.update(subscriptions)
            .set({ exitRequestedAt: new Date() })
            .where(eq(subscriptions.id, subscription.id));

        return NextResponse.json({ success: true, message: "Exit workflow initiated. Access will continue until cycle ends." });

    } catch (error: any) {
        console.error("[EXIT_REQUEST_ERROR]", error);
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}
