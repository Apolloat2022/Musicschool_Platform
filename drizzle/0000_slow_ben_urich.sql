CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_name" text NOT NULL,
	"student_email" text NOT NULL,
	"class_id" integer,
	"enrolled_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "music_classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"instrument" text,
	"day_of_week" text,
	"start_time" text,
	"jitsi_room_name" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "music_classes_jitsi_room_name_unique" UNIQUE("jitsi_room_name")
);
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_class_id_music_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."music_classes"("id") ON DELETE no action ON UPDATE no action;