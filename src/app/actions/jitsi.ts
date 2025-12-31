"use strict";
"use server";

import { signJitsiToken } from "@/lib/jitsi-auth";

export async function getJitsiToken(room: string, userName: string, userEmail?: string) {
    if (room === "health-check") {
        return { token: "health-ok", error: null };
    }

    try {
        console.log(`[Jitsi Action] START: room=${room}, user=${userName}`);

        const signingPromise = signJitsiToken({
            room,
            userName,
            userEmail,
            isModerator: false,
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Vercel Server Timeout (12s)")), 12000)
        );

        console.log(`[Jitsi Action] Racing signing vs timeout...`);
        const token = await Promise.race([signingPromise, timeoutPromise]) as string;

        console.log(`[Jitsi Action] SUCCESS: Token generated.`);
        return { token, error: null };
    } catch (error: any) {
        console.error(`[Jitsi Action] FATAL ERROR: ${error.message}`);
        return { token: null, error: error.message };
    }
}
