import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    const sql = neon(process.env.DATABASE_URL!);
    try {
        const res = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'music_classes';`;
        console.log("Columns:", res.map(row => row.column_name));
    } catch (err) {
        console.error("DB error:", err);
    }
}
run();
