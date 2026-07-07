"use strict";
"use server";

import crypto from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import { getAcademyRole } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// SECURITY: this is a public server action. The Zoom `role` (0 = attendee,
// 1 = host) must be decided server-side from the authenticated session — never
// accepted from the client, or any attendee could request host and control the
// meeting. The `requestedRole` param is ignored for privilege purposes.
export async function getZoomSignature(meetingNumber: string, _requestedRole?: number) {
    const sdkKey = process.env.ZOOM_SDK_KEY;
    const sdkSecret = process.env.ZOOM_SDK_SECRET;

    if (!sdkKey || !sdkSecret) {
        return { signature: null, error: "Zoom SDK Key or Secret not configured." };
    }

    // Resolve host privilege from the server session.
    const user = await currentUser();
    const musicClass = await db.query.musicClasses.findFirst({
        where: eq(musicClasses.zoomMeetingNumber, meetingNumber),
    });
    const academyRole = await getAcademyRole(user, musicClass?.id);
    const role = academyRole === "MODERATOR" ? 1 : 0;

    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // 2 hours

    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
        sdkKey: sdkKey,
        mn: meetingNumber,
        role: role,
        iat: iat,
        exp: exp,
        tokenExp: exp,
    };

    const sHeader = Buffer.from(JSON.stringify(header)).toString("base64").replace(/=/g, "");
    const sPayload = Buffer.from(JSON.stringify(payload)).toString("base64").replace(/=/g, "");

    const signature = crypto
        .createHmac("sha256", sdkSecret)
        .update(sHeader + "." + sPayload)
        .digest("base64")
        .replace(/=/g, "");

    return { signature: `${sHeader}.${sPayload}.${signature}`, error: null };
}
