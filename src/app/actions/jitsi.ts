"use strict";
"use server";

import { signJitsiToken } from "@/lib/jitsi-auth";

export async function getJitsiToken(room: string, userName: string, userEmail?: string) {
    try {
        console.log(`[Jitsi Production] Starting token generation for room: ${room}`);
        const token = signJitsiToken({
            room,
            userName,
            userEmail,
            isModerator: false,
        });
        console.log(`[Jitsi Production] Token generation successful.`);
        return { token, error: null };
    } catch (error: any) {
        console.error("[Jitsi Production] Token generation failed:", error.message);
        return { token: null, error: error.message };
    }
}
