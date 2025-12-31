import { db } from "./src/lib/db";
import { musicClasses, enrollments } from "./src/lib/db/schema";

async function diag() {
    console.log("--- DIZZLE DIAGNOSTIC ---");

    try {
        const classes = await db.select().from(musicClasses);
        console.log("CLASSES:", JSON.stringify(classes, null, 2));

        const allEnrollments = await db.select().from(enrollments);
        console.log("ENROLLMENTS:", JSON.stringify(allEnrollments, null, 2));
    } catch (err) {
        console.error("DB ERROR:", err);
    }
}

diag();
