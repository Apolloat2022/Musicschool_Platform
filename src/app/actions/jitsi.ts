"use strict";
"use server";

import { signJitsiToken } from "@/lib/jitsi-auth";

export async function getJitsiToken(room: string, userName: string, userEmail?: string) {
    if (room === "health-check") {
        return { token: "health-ok", error: null };
    }

    try {
        console.log(`[Jitsi Action] START: room=${room}`);

        // Vercel execution limit is often 10s on hobby plan. 
        // We set 8s to ensure we return a response before Vercel kills us.
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server timeout after 8 seconds. Please refresh.")), 8000)
        );

        const token = await Promise.race([
            signJitsiToken({
                room,
                userName,
                userEmail,
                isModerator: false,
            }),
            timeoutPromise
        ]) as string;

        console.log(`[Jitsi Action] SUCCESS`);
        return { token, error: null };
    } catch (error: any) {
        console.error(`[Jitsi Action] FAIL: ${error.message}`);
        // Return a clean error message to the frontend
        return { token: null, error: error.message || "Secret key signing failure" };
    }
}
