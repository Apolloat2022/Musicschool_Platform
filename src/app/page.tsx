import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const classes = await db.select().from(musicClasses);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.png" 
            alt="Apollo Performing Arts & Academy" 
            width={120} 
            height={120} 
            className="rounded-full border-2 border-indigo-500 p-1"
          />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Apollo <span className="text-indigo-500">Performing Arts</span> & Academy
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Elevate your musical journey with world-class instructors. 
          Join a live session today at <span className="text-white">apollotunes.com</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-indigo-500 transition-all group">
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-indigo-400 transition">{cls.title}</h2>
            <div className="flex items-center gap-3 text-slate-400 mb-6">
              <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-indigo-300">
                {cls.instrument}
              </span>
              <span>{cls.dayOfWeek} • {cls.startTime}</span>
            </div>
            <Link 
              href={`/enroll/${cls.id}`} 
              className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-600/20"
            >
              Secure Your Spot
            </Link>
          </div>
        ))}
      </div>

      <footer className="mt-20 text-center border-t border-slate-900 pt-10">
        <p className="text-slate-600 text-sm mb-4">© 2025 Apollo Performing Arts & Academy</p>
        <Link href="/admin" className="text-slate-500 hover:text-indigo-400 text-xs uppercase tracking-widest transition">
          Faculty Portal
        </Link>
      </footer>
    </main>
  );
}