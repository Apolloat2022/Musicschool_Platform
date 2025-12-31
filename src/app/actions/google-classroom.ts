"use strict";
"use server";

import { syncClassroomRoster, postHomework, getAssignments } from "@/lib/google-classroom";
import { auth } from "@clerk/nextjs/server";

async function getAccessToken() {
    const { getToken } = await auth();
    const token = await getToken({ template: "google_classroom" }); // Assumes a template named this way
    if (!token) throw new Error("Google Classroom access token not found. Please sync your account.");
    return token;
}

export async function syncRosterAction(courseId: string) {
    try {
        const token = await getAccessToken();
        const students = await syncClassroomRoster(token, courseId);
        return { students, error: null };
    } catch (error: any) {
        console.error("Roster sync failed:", error);
        return { students: [], error: error.message };
    }
}

export async function postHomeworkAction(courseId: string, homework: { title: string; description: string; link: string }) {
    try {
        const token = await getAccessToken();
        const result = await postHomework(token, courseId, homework);
        return { result, error: null };
    } catch (error: any) {
        console.error("Homework posting failed:", error);
        return { result: null, error: error.message };
    }
}

export async function getAssignmentsAction(courseId: string) {
    try {
        const token = await getAccessToken();
        const assignments = await getAssignments(token, courseId);
        return { assignments, error: null };
    } catch (error: any) {
        console.error("Failed to fetch assignments:", error);
        return { assignments: [], error: error.message };
    }
}
