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

    if (!appId || !rawKey) {
        throw new Error("Jitsi Configuration Error: Application ID and Private Key are required.");
    }

    // Aggressive cleanup: remove all whitespace, quotes, then re-format as proper PEM
    let cleanKey = rawKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '')
        .replace(/["']/g, '') // Remove any accidental quotes from Vercel UI
        .replace(/\s/g, '');

    console.log(`[Jitsi Auth] Raw Key Length: ${rawKey.length}, Cleaned: ${cleanKey.length}`);

    // Reconstruct valid PEM
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${cleanKey.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

    const payload = {
        aud: "jitsi",
        iss: appId, // MUST be the App ID for JaaS (8x8.vc)
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

    try {
        console.log(`[Jitsi Auth] Signing token...`);
        const signedToken = jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: kid });
        console.log(`[Jitsi Auth] Token signed successfully.`);
        return signedToken;
    } catch (signError: any) {
        console.error("[Jitsi Auth] JWT Sign Error:", signError.message);
        throw signError;
    }
}
