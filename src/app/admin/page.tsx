import { db } from "@/lib/db";
import { musicClasses, enrollments } from "@/lib/db/schema";
import { createClass, deleteClass, logoutAction } from "@/lib/actions";
import { Music, Plus, Video, Trash2, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { eq } from "drizzle-orm";

export default async function AdminPage() {
  // Simpler fetch: just get classes. We will get students later.
  const classes = await db.select().from(musicClasses);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/" className="bg-white border text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <Home size={18} /> Home Page
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="bg-white border hover:bg-red-50 text-slate-700 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                <LogOut size={18} /> Logout
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus /> New Class</h2>
            <form action={createClass} className="space-y-4">
              <input name="title" placeholder="Class Title" className="w-full p-3 border rounded-xl" required />
              <input name="teacherName" placeholder="Teacher Name" className="w-full p-3 border rounded-xl" required />
              <input name="instrument" placeholder="Instrument" className="w-full p-3 border rounded-xl" required />
              <input name="dayOfWeek" placeholder="Day (e.g. Monday)" className="w-full p-3 border rounded-xl" required />
              <input name="startTime" type="time" className="w-full p-3 border rounded-xl" required />
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">Save Class</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Your Schedule</h2>
            {classes.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-slate-500 text-sm">
                    {c.instrument} {c.teacherName && c.teacherName !== "TBA" ? `(taught by ${c.teacherName})` : ""} | {c.dayOfWeek} at {c.startTime}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/enroll/${c.id}`} className="text-indigo-600 px-3 py-2 border rounded-lg text-xs font-bold">Enroll Link</Link>
                  <Link href={`/classroom/${c.id}`} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <Video size={16} /> Start
                  </Link>
                  <form action={deleteClass}>
                    <input type="hidden" name="classId" value={c.id} />
                    <button
                      type="submit"
                      title="Delete class"
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 font-bold transition-colors"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
