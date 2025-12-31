"use strict";
"use server";

import { signJitsiToken } from "@/lib/jitsi-auth";

export async function getJitsiToken(room: string, userName: string, userEmail?: string) {
    if (room === "health-check") {
        return { token: "health-ok", error: null };
    }

    const appId = process.env.JITSI_APPLE_API || process.env.JITSI_API || process.env.NEXT_PUBLIC_JITSI_APP_ID;

    try {
        console.log(`[Jitsi Action] Starting for room: ${room}`);

        if (!appId) {
            throw new Error("Missing Jitsi App ID on server.");
        }

        const fullRoomName = room.startsWith(appId) ? room : `${appId}/${room}`;
        console.log(`[Jitsi Action] Target Room: ${fullRoomName}`);

        // Vercel execution limit is often 10s on hobby plan. 
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server timeout (8s). The crypto operation took too long.")), 8000)
        );

        const token = await Promise.race([
            signJitsiToken({
                room: fullRoomName,
                userName,
                userEmail,
                isModerator: false,
            }),
            timeoutPromise
        ]) as string;

        console.log(`[Jitsi Action] SUCCESS: Token generated for ${fullRoomName}`);
        return { token, error: null };
    } catch (error: any) {
        console.error(`[Jitsi Action] ERROR: ${error.message}`);
        return { token: null, error: error.message || "Unknown signing error" };
    }
}
