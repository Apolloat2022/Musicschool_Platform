import { google } from "googleapis";

const classroom = google.classroom("v1");

export async function getGoogleClassroomClient(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return auth;
}

export async function syncClassroomRoster(accessToken: string, courseId: string) {
    const auth = await getGoogleClassroomClient(accessToken);
    const response = await classroom.courses.students.list({
        courseId,
        auth,
    });
    return response.data.students || [];
}

export async function postHomework(
    accessToken: string,
    courseId: string,
    homework: { title: string; description: string; link: string }
) {
    const auth = await getGoogleClassroomClient(accessToken);
    const response = await classroom.courses.courseWork.create({
        courseId,
        auth,
        requestBody: {
            title: homework.title,
            description: homework.description,
            materials: [
                {
                    link: {
                        url: homework.link,
                    },
                },
            ],
            workType: "ASSIGNMENT",
            state: "PUBLISHED",
        },
    });
    return response.data;
}

export async function getAssignments(accessToken: string, courseId: string) {
    const auth = await getGoogleClassroomClient(accessToken);
    const response = await classroom.courses.courseWork.list({
        courseId,
        auth,
        orderBy: "updateTime desc",
    });
    return response.data.courseWork || [];
}

/**
 * Post a note / lecture material to Google Classroom as an announcement.
 */
export async function postNote(
    accessToken: string,
    courseId: string,
    note: { title: string; text: string }
) {
    const auth = await getGoogleClassroomClient(accessToken);
    const response = await classroom.courses.announcements.create({
        courseId,
        auth,
        requestBody: {
            text: `**${note.title}**\n\n${note.text}`,
            state: "PUBLISHED",
        },
    });
    return response.data;
}

/**
 * Fetch all announcements (notes) for a course.
 */
export async function getCourseAnnouncements(accessToken: string, courseId: string) {
    const auth = await getGoogleClassroomClient(accessToken);
    const response = await classroom.courses.announcements.list({
        courseId,
        auth,
        orderBy: "updateTime desc",
    });
    return response.data.announcements || [];
}
