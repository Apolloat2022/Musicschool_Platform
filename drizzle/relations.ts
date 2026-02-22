import { relations } from "drizzle-orm/relations";
import { musicClasses, enrollments } from "./schema";

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
	musicClass: one(musicClasses, {
		fields: [enrollments.classId],
		references: [musicClasses.id]
	}),
}));

export const musicClassesRelations = relations(musicClasses, ({many}) => ({
	enrollments: many(enrollments),
}));