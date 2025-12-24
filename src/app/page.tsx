import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import Link from "next/link";

export default async function HomePage() {
  const classes = await db.select().from(musicClasses);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Music Masterclass</h1>
        <p className="text-slate-400 text-lg">Join a live high-fidelity session and master your craft.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500 transition">
            <h2 className="text-2xl font-semibold mb-2">{cls.title}</h2>
            <p className="text-indigo-400 mb-4">{cls.instrument} • {cls.dayOfWeek} at {cls.startTime}</p>
            <Link 
              href={`/enroll/${cls.id}`} 
              className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
            >
              Enroll Now
            </Link>
          </div>
        ))}
      </div>

      <footer className="mt-20 text-center">
        <Link href="/admin" className="text-slate-500 hover:text-slate-300 text-sm underline">
          Teacher Login
        </Link>
      </footer>
    </main>
  );
}