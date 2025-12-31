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

    // Aggressive cleanup: remove all whitespace, then re-format as proper PEM
    // This handles cases where Vercel might have added spaces, carriage returns, or literal \n
    let cleanKey = rawKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '')
        .replace(/\s/g, '');

    // Reconstruct valid PEM
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${cleanKey.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

    console.log(`[Jitsi Auth] Key structured, size: ${privateKey.length}`);

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

    try {
        const signedToken = jwt.sign(payload, privateKey, { algorithm: "RS256", keyid: kid });
        return signedToken;
    } catch (signError: any) {
        console.error("[Jitsi Auth] JWT Sign Error:", signError.message);
        throw new Error(`JWT Signing failed: ${signError.message}`);
    }
}
