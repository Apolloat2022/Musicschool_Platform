import { db } from "./db";
import { enrollments } from "./db/schema";
import { and, eq } from "drizzle-orm";

export type UserRole = "MODERATOR" | "STUDENT" | "GUEST";

export async function getAcademyRole(user: any, musicClassId?: number): Promise<UserRole> {
    if (!user) return "GUEST";

    const userEmail = user.emailAddresses[0]?.emailAddress || "";

    // 1. Check if user is an admin/instructor
    const isAdmin = user.publicMetadata?.role === "admin" ||
        user.publicMetadata?.role === "instructor" ||
        userEmail === "revanaglobal@gmail.com" ||
        userEmail === "pandey201@yahoo.com";

    if (isAdmin) return "MODERATOR";

    // 2. Check for enrollment if a specific class is provided
    if (musicClassId) {
        const enrollment = await db.query.enrollments.findFirst({
            where: (enrollments, { and, eq }) => and(
                eq(enrollments.classId, musicClassId),
                eq(enrollments.studentEmail, userEmail)
            )
        });

        if (enrollment) return "STUDENT";
    }

    // Fallback: If not an admin and not enrolled in the specific class (or no class ID), 
    // they are a GUEST (can only use Zoom)
    return "GUEST";
}
