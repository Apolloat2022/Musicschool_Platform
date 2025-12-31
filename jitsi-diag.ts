import * as jose from "jose";

async function diag() {
    console.log("--- JITSI HANDSHAKE DIAGNOSTIC ---");

    const appId = process.env.JITSI_APPLE_API || process.env.JITSI_API || process.env.NEXT_PUBLIC_JITSI_APP_ID;
    const rawKey = process.env.JITSI_PRIVATE_KEY;
    const kid = process.env.JITSI_PUBLIC_KEY;

    console.log(`App ID: ${appId}`);
    console.log(`Public Key ID (kid): ${kid || "NOT SET (will fallback to App ID)"}`);
    console.log(`Private Key length: ${rawKey?.length || 0}`);

    if (!appId || !rawKey) {
        console.error("FAIL: Missing App ID or Private Key");
        return;
    }

    // Same cleanup logic
    let cleanKey = rawKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '')
        .replace(/["']/g, '')
        .replace(/\s/g, '');

    const chunks = [];
    for (let i = 0; i < cleanKey.length; i += 64) {
        chunks.push(cleanKey.slice(i, i + 64));
    }
    const privateKeyPEM = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----`;

    try {
        console.log("Applying Signature Test...");
        const privateKey = await jose.importPKCS8(privateKeyPEM, "RS256");

        const payload = {
            aud: "jitsi",
            iss: "chat",
            sub: appId,
            room: "*",
            context: {
                user: {
                    id: "diag-test",
                    name: "Explorer",
                    email: "test@example.com",
                    affiliation: "owner",
                },
                features: {
                    livestreaming: true,
                    recording: true,
                    transcription: true,
                    "outbound-call": false,
                },
            },
        };

        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: "RS256", kid: kid || appId })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(privateKey);

        console.log("SUCCESS: Token generated.");
        console.log("Token Preview:", token.substring(0, 50) + "...");

        // Decode header to check kid
        const decoded = jose.decodeProtectedHeader(token);
        console.log("TOKEN HEADER:", JSON.stringify(decoded));

    } catch (err: any) {
        console.error("SIGNING FAILED:", err.message);
    }
}

diag();
