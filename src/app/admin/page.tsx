import { db } from "@/lib/db";
import { musicClasses, enrollments } from "@/lib/db/schema";
import { createClass } from "@/lib/actions";
import { Music, Plus, Video, Users } from "lucide-react";
import Link from "next/link";
import { eq } from "drizzle-orm";

export default async function AdminPage() {
  // Simpler fetch: just get classes. We will get students later.
  const classes = await db.select().from(musicClasses);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus /> New Class</h2>
            <form action={createClass} className="space-y-4">
              <input name="title" placeholder="Class Title" className="w-full p-3 border rounded-xl" required />
              <input name="instrument" placeholder="Instrument" className="w-full p-3 border rounded-xl" required />
              <input name="dayOfWeek" placeholder="Day (e.g. Monday)" className="w-full p-3 border rounded-xl" required />
              <input name="startTime" type="time" className="w-full p-3 border rounded-xl" required />
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">Save Class</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Your Schedule</h2>
            {classes.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-slate-500 text-sm">{c.instrument} | {c.dayOfWeek} at {c.startTime}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/enroll/${c.id}`} className="text-indigo-600 px-3 py-2 border rounded-lg text-xs font-bold">Enroll Link</Link>
                  <Link href={`/classroom/${c.id}`} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <Video size={16}/> Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
