"use strict";
"use server";

import { signJitsiToken } from "@/lib/jitsi-auth";
import { currentUser } from "@clerk/nextjs/server";
import { getAcademyRole } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// SECURITY: this is a public server action. Never trust the caller for the
// moderator flag or their identity — both are derived server-side from the
// authenticated Clerk session and the enrollment/role check. The client-side
// `isModerator` prop is used only for local UI (e.g. the trial timer) and has
// no bearing on the privileges baked into the signed token.
export async function getJitsiToken(room: string, requestedName?: string) {
    if (room === "health-check") {
        return { token: "health-ok", error: null };
    }

    const appId = process.env.JITSI_APPLE_API || process.env.JITSI_API || process.env.NEXT_PUBLIC_JITSI_APP_ID;

    try {
        if (!appId) {
            throw new Error("Missing Jitsi App ID on server.");
        }

        // Resolve identity + privilege from the server session, not the client.
        const user = await currentUser();

        // Map the room back to its class so role can be evaluated per-class.
        const musicClass = await db.query.musicClasses.findFirst({
            where: eq(musicClasses.jitsiRoomName, room),
        });

        const role = await getAcademyRole(user, musicClass?.id);
        const isModerator = role === "MODERATOR";

        const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
        const userId = user?.id || `guest-${Math.random().toString(36).substring(2, 9)}`;
        // Display name only — carries no privilege. Prefer the real name.
        const userName =
            (user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : null) ||
            user?.username ||
            requestedName ||
            "Guest";

        const appIdClean = appId.trim();
        const roomClean = room.trim();
        const fullRoomName = roomClean.startsWith(appIdClean) ? roomClean : `${appIdClean}/${roomClean}`;

        // Vercel execution limit is often 10s on hobby plan.
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server timeout (8s). The crypto operation took too long.")), 8000)
        );

        const token = await Promise.race([
            signJitsiToken({
                room: fullRoomName,
                userName,
                userEmail,
                userId,
                isModerator,
            }),
            timeoutPromise
        ]) as string;

        return { token, error: null };
    } catch (error: any) {
        console.error(`[Jitsi Action] ERROR: ${error.message}`);
        return { token: null, error: error.message || "Unknown signing error" };
    }
}
