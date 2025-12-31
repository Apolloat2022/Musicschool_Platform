import jwt from "jsonwebtoken";

export interface JitsiTokenOptions {
    room: string;
    userName: string;
    userEmail?: string;
    isModerator?: boolean;
}

export function signJitsiToken(options: JitsiTokenOptions) {
    const appId = process.env.JITSI_APPLE_API;
    const privateKey = process.env.JITSI_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!appId || !privateKey) {
        throw new Error("Jitsi App ID or Private Key not configured in environment.");
    }

    const payload = {
        aud: "jitsi",
        iss: "chat",
        sub: appId,
        room: options.room === "*" ? "*" : options.room,
        context: {
            user: {
                name: options.userName,
                email: options.userEmail || "",
                affiliation: options.isModerator ? "owner" : "member",
            },
            features: {
                livestreaming: "true",
                recording: "true",
                transcription: "true",
                "outbound-call": "false",
            },
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        nbf: Math.floor(Date.now() / 1000) - 10,
    };

    return jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: process.env.JITSI_PUBLIC_KEY });
}
