import * as jose from "jose";

export interface JitsiTokenOptions {
    room: string;
    userName: string;
    userId: string;
    userEmail?: string;
    isModerator?: boolean;
}

export async function signJitsiToken(options: JitsiTokenOptions) {
    const appId = process.env.JITSI_APPLE_API || process.env.JITSI_API || process.env.NEXT_PUBLIC_JITSI_APP_ID;
    const rawKey = process.env.JITSI_PRIVATE_KEY;
    const kid = process.env.JITSI_PUBLIC_KEY || appId;

    if (!appId || !rawKey) {
        throw new Error("Jitsi Configuration Error: Application ID and Private Key are required.");
    }

    console.log(`[Jitsi Auth] STEP 1: Variables loaded. AppId=${appId ? 'OK' : 'MISSING'}`);

    // Aggressive cleanup: remove all whitespace, quotes, then re-format as proper PEM
    let cleanKey = rawKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '')
        .replace(/["']/g, '') // Remove any accidental quotes from Vercel UI
        .replace(/\s/g, '');

    // Reliable PEM reconstruction
    const chunks = [];
    for (let i = 0; i < cleanKey.length; i += 64) {
        chunks.push(cleanKey.slice(i, i + 64));
    }
    const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----`;

    try {
        const privateKey = await jose.importPKCS8(privateKeyPEM, "RS256");

        const payload = {
            aud: "jitsi",
            iss: "8x8.vc", // Updated from 'chat' per user feedback
            sub: appId,
            room: "*", // Keep wildcard for broad permission
            context: {
                user: {
                    id: options.userId,
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
        };

        console.log(`[Jitsi Auth] Signing Payload:`, JSON.stringify(payload, null, 2));

        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: "RS256", kid: kid })
            .setIssuedAt()
            .setNotBefore(Math.floor(Date.now() / 1000) - 60) // 1 minute in the past to prevent clock drift
            .setExpirationTime("1h")
            .sign(privateKey);

        return token;
    } catch (error: any) {
        console.error(`[Jitsi Auth] Error:`, error.message);
        throw error;
    }
}
