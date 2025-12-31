import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const musicClasses = pgTable("music_classes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  instrument: text("instrument"),
  dayOfWeek: text("day_of_week"),
  startTime: text("start_time"),
  jitsiRoomName: text("jitsi_room_name").unique(),
  googleCourseId: text("google_course_id"),
  zoomMeetingNumber: text("zoom_meeting_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  classId: integer("class_id").references(() => musicClasses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

export const musicClassRelations = relations(musicClasses, ({ many }) => ({
  enrollments: many(enrollments),
}));

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  musicClass: one(musicClasses, {
    fields: [enrollments.classId],
    references: [musicClasses.id],
  }),
}));
