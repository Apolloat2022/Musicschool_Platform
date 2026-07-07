import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
    throw new Error(
        "JWT_SECRET is not set. Refusing to start with an insecure default admin-session signing key."
    );
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = "admin_session";

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, SECRET, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function getAdminSession() {
    const session = (await cookies()).get(COOKIE_NAME)?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function setAdminSession(userId: string) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ userId, expires });

    (await cookies()).set(COOKIE_NAME, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function logoutAdmin() {
    (await cookies()).set(COOKIE_NAME, "", { expires: new Date(0), path: "/" });
}

export function isAdminAuthenticated(session: any) {
    return !!session && new Date(session.expires) > new Date();
}

/**
 * Guard for admin-only server actions. Server actions are public POST
 * endpoints, so every mutating admin action must call this itself — being
 * rendered only on an admin page does NOT protect it. Throws if the caller
 * does not hold a valid admin session.
 */
export async function requireAdmin() {
    let session: any = null;
    try {
        session = await getAdminSession();
    } catch {
        session = null;
    }
    if (!isAdminAuthenticated(session)) {
        throw new Error("Unauthorized: admin session required.");
    }
    return session;
}
