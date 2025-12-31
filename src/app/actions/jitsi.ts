"use strict";
"use server";

import { signJitsiToken } from "@/lib/jitsi-auth";

export async function getJitsiToken(room: string, userName: string, userEmail?: string) {
    try {
        console.log(`[Jitsi Action] Starting token generation for room: ${room}`);

        // Add a safety timeout to the signing process itself
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Token signing timed out on server")), 10000)
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

        console.log(`[Jitsi Action] Token generation successful.`);
        return { token, error: null };
    } catch (error: any) {
        console.error("[Jitsi Action] Error:", error.message);
        return { token: null, error: error.message };
    }
}
