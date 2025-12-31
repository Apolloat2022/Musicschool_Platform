import jwt from "jsonwebtoken";

export interface JitsiTokenOptions {
    room: string;
    userName: string;
    userEmail?: string;
    isModerator?: boolean;
}

export function signJitsiToken(options: JitsiTokenOptions) {
    const appId = process.env.JITSI_APPLE_API || process.env.JITSI_API || process.env.NEXT_PUBLIC_JITSI_APP_ID;
    const rawKey = process.env.JITSI_PRIVATE_KEY;
    const kid = process.env.JITSI_PUBLIC_KEY || appId;

    console.log(`[Jitsi Auth Check] AppId: ${appId ? 'OK' : 'MISSING'}`);
    console.log(`[Jitsi Auth Check] PrivateKey: ${rawKey ? 'OK' : 'MISSING'}`);
    console.log(`[Jitsi Auth Check] KID: ${kid ? 'OK' : 'MISSING'}`);

    if (!appId || !rawKey) {
        const missing = [];
        if (!appId) missing.push("App ID");
        if (!rawKey) missing.push("Private Key");
        const errorMsg = `Jitsi Configuration Error: Missing ${missing.join(" and ")}.`;
        console.error(`[Jitsi Auth Error] ${errorMsg}`);
        throw new Error(errorMsg);
    }

    // Handle both literal \n and real newlines
    const privateKey = rawKey.replace(/\\n/g, '\n').trim();

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
