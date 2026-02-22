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
    // 1. Try to extract from a full Google Classroom URL
    // Supports: https://classroom.google.com/c/385615069755 or https://classroom.google.com/c/Mzg1NjE1MDY5NzU1
    const urlMatch = idInput.match(/\/c\/([a-zA-Z0-9_-]+)/);
    const extractedId = urlMatch ? urlMatch[1] : idInput.trim();

    // 2. If the extracted ID is already numeric, return it compliance-ready
    if (/^\d+$/.test(extractedId)) return extractedId;

    // 3. Fallback: Decode Base64 string to see if it reveals the numeric ID
    try {
        const decoded = Buffer.from(extractedId, 'base64').toString('utf-8');
        const match = decoded.match(/\d{10,}/);
        return match ? match[0] : extractedId;
    } catch (e) {
        return extractedId;
    }
}

/**
 * Standardized error handler for Google APIs to log detail for Vercel
 * and return user-friendly strings for 403 and 404 constraints.
 */
function handleGoogleApiError(error: unknown, context: string) {
    let msg = "Unknown error";
    let status: number | undefined;

    if (typeof error === "object" && error !== null) {
        const gError = error as any;
        msg = gError.message || msg;
        status = gError.status || gError.response?.status || gError.code;
    } else if (error instanceof Error) {
        msg = error.message;
    }

    // Map common Google Classroom API HTTP status errors
    if (status === 404) {
        msg = "Course Not Found (404). The ID provided does not exist or you are not enrolled as an active teacher.";
    } else if (status === 403) {
        msg = "Forbidden (403). You do not have sufficient permissions to access or modify this course.";
    }

    console.error(`[Google API Error | ${context}] Status: ${status || 'N/A'} -`, error);
    return msg;
}

export async function syncRosterAction(courseId: string) {
    courseId = getNumericCourseId(courseId);
    try {
        const token = await getAccessToken();
        const students = await syncClassroomRoster(token, courseId);
        return { students, error: null };
    } catch (error: unknown) {
        const msg = handleGoogleApiError(error, "syncRosterAction");
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
        const msg = handleGoogleApiError(error, "postHomeworkAction");
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
        const msg = handleGoogleApiError(error, "getAssignmentsAction");
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
        const msg = handleGoogleApiError(error, "postNoteAction");
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
        const msg = handleGoogleApiError(error, "getAnnouncementsAction");
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
