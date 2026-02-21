import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    const sql = neon(process.env.DATABASE_URL!);
    try {
        const res = await sql`select "id", "title", "instrument", "day_of_week", "start_time", "jitsi_room_name", "google_course_id", "zoom_meeting_number", "created_at" from "music_classes"`;
        console.log("Success:", res.length, "rows");
    } catch (err) {
        console.error("DB Error details:", err);
    }
}
run();
