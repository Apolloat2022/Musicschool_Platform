import * as jose from "jose";

export interface JitsiTokenOptions {
    room: string;
    userName: string;
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

    // Aggressive cleanup: remove all whitespace, quotes, then re-format as proper PEM
    let cleanKey = rawKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '')
        .replace(/["']/g, '') // Remove any accidental quotes from Vercel UI
        .replace(/\s/g, '');

    console.log(`[Jitsi Auth] Key processing started. Cleaned length: ${cleanKey.length}`);

    // Reconstruct valid PEM
    const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${cleanKey.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

    try {
        console.log(`[Jitsi Auth] Importing private key...`);
        const privateKey = await jose.importPKCS8(privateKeyPEM, "RS256");

        console.log(`[Jitsi Auth] Signing token with jose...`);
        const token = await new jose.SignJWT({
            aud: "jitsi",
            iss: appId,
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
        })
            .setProtectedHeader({ alg: "RS256", kid: kid })
            .setIssuedAt()
            .setExpirationTime("1h")
            .setNotBefore("10s ago")
            .sign(privateKey);

        console.log(`[Jitsi Auth] Token signed successfully with jose.`);
        return token;
    } catch (error: any) {
        console.error("[Jitsi Auth] Jose sign error:", error.message);
        throw error;
    }
}
