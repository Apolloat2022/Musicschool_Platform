import { pgTable, foreignKey, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const enrollments = pgTable("enrollments", {
	id: serial().primaryKey().notNull(),
	studentName: text("student_name").notNull(),
	studentEmail: text("student_email").notNull(),
	classId: integer("class_id"),
	enrolledAt: timestamp("enrolled_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.classId],
			foreignColumns: [musicClasses.id],
			name: "enrollments_class_id_music_classes_id_fk"
		}),
]);

export const musicClasses = pgTable("music_classes", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	instrument: text(),
	dayOfWeek: text("day_of_week"),
	startTime: text("start_time"),
	jitsiRoomName: text("jitsi_room_name"),
	googleCourseId: text("google_course_id"),
	zoomMeetingNumber: text("zoom_meeting_number"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	teacherName: text("teacher_name").default('TBA'),
}, (table) => [
	unique("music_classes_jitsi_room_name_unique").on(table.jitsiRoomName),
]);
