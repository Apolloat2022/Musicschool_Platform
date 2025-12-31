import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "apollo-music-academy-secret-2025");
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
