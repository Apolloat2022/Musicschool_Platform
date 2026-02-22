"use server";

import {
    syncClassroomRoster,
    postHomework,
    getAssignments,
    postNote,
    getCourseAnnouncements,
} from "@/lib/google-classroom";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getAccessToken() {
    const { getToken } = await auth();
    const token = await getToken({ template: "google_classroom" });
    if (!token) throw new Error("Google Classroom access token not found. Please sync your account.");
    return token;
}

function getNumericCourseId(idInput: string): string {
    // If the input is already numeric, return it
    if (/^\d+$/.test(idInput)) return idInput;

    try {
        // Decode Base64 string to see if it reveals the numeric ID
        const decoded = Buffer.from(idInput, 'base64').toString('utf-8');
        // Regex to extract the first long number found in the decoded string
        const match = decoded.match(/\d{10,}/);
        return match ? match[0] : idInput;
    } catch (e) {
        return idInput; // Fallback to original if decoding fails
    }
}

export async function syncRosterAction(courseId: string) {
    courseId = getNumericCourseId(courseId);
    try {
        const token = await getAccessToken();
        const students = await syncClassroomRoster(token, courseId);
        return { students, error: null };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Roster sync failed:", error);
        return { students: [], error: msg };
    }
}

export async function postHomeworkAction(
    courseId: string,
    homework: { title: string; description: string; link: string }
) {
    courseId = getNumericCourseId(courseId);
    try {
        const token = await getAccessToken();
        const result = await postHomework(token, courseId, homework);
        return { result, error: null };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Homework posting failed:", error);
        return { result: null, error: msg };
    }
}

export async function getAssignmentsAction(courseId: string) {
    courseId = getNumericCourseId(courseId);
    try {
        const token = await getAccessToken();
        const assignments = await getAssignments(token, courseId);
        return { assignments, error: null };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to fetch assignments:", error);
        return { assignments: [], error: msg };
    }
}

export async function postNoteAction(
    courseId: string,
    note: { title: string; text: string }
) {
    courseId = getNumericCourseId(courseId);
    try {
        const token = await getAccessToken();
        const result = await postNote(token, courseId, note);
        return { result, error: null };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Note posting failed:", error);
        return { result: null, error: msg };
    }
}

export async function getAnnouncementsAction(courseId: string) {
    courseId = getNumericCourseId(courseId);
    try {
        const token = await getAccessToken();
        const announcements = await getCourseAnnouncements(token, courseId);
        return { announcements, error: null };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to fetch announcements:", error);
        return { announcements: [], error: msg };
    }
}

/**
 * Links an existing music class in the DB to a Google Classroom course ID.
 */
export async function linkCourseIdAction(classId: number, courseId: string) {
    courseId = getNumericCourseId(courseId);
    try {
        await db
            .update(musicClasses)
            .set({ googleCourseId: courseId })
            .where(eq(musicClasses.id, classId));
        revalidatePath("/faculty/dashboard");
        revalidatePath("/admin");
        return { error: null };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to link course ID:", error);
        return { error: msg };
    }
}
