"use strict";
"use server";

import { signJitsiToken } from "@/lib/jitsi-auth";

export async function getJitsiToken(room: string, userName: string, userEmail?: string) {
    try {
        const token = signJitsiToken({
            room,
            userName,
            userEmail,
            isModerator: false, // Default to false, logic can be updated for faculty
        });
        return { token, error: null };
    } catch (error: any) {
        console.error("Failed to generate Jitsi token:", error);
        return { token: null, error: error.message };
    }
}
