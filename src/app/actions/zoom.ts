"use strict";
"use server";

import crypto from "crypto";

export async function getZoomSignature(meetingNumber: string, role: number) {
    const sdkKey = process.env.ZOOM_SDK_KEY;
    const sdkSecret = process.env.ZOOM_SDK_SECRET;

    if (!sdkKey || !sdkSecret) {
        return { signature: null, error: "Zoom SDK Key or Secret not configured." };
    }

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
