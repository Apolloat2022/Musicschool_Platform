import jwt from "jsonwebtoken";

export interface JitsiTokenOptions {
    room: string;
    userName: string;
    userEmail?: string;
    isModerator?: boolean;
}

export function signJitsiToken(options: JitsiTokenOptions) {
    const appId = process.env.JITSI_APPLE_API || process.env.JITSI_API;
    let privateKey = process.env.JITSI_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
    const kid = process.env.JITSI_PUBLIC_KEY || appId;

    if (!appId || !privateKey) {
        throw new Error("Jitsi Configuration Error: Application ID and Private Key are required.");
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

    const signedToken = jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: kid });
    return signedToken;
}
