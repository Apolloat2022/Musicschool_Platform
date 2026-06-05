"use server";

import { db } from "@/lib/db";
import { attendance } from "@/lib/db/schema";

export async function logAttendance(enrollmentId: number, classId: number, durationMinutes: number) {
    try {
        await db.insert(attendance).values({
            enrollmentId,
            classId,
            date: new Date(),
            status: "PRESENT",
            durationMinutes
        });
        return { success: true };
    } catch (error) {
        console.error("Error logging attendance:", error);
        return { success: false, error: "Failed to log attendance" };
    }
}
