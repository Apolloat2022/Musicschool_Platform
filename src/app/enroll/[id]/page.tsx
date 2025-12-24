import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { enrollStudent } from "@/lib/actions";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Try to find the class
  const data = await db.select().from(musicClasses).where(eq(musicClasses.id, parseInt(id)));
  const musicClass = data[0];

  // If the ID doesn't exist in the DB, Next.js shows the 404/notFound page
  if (!musicClass) notFound();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white text-black p-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Enroll: {musicClass.title}</h1>
        <p className="text-slate-500 mb-6">{musicClass.instrument} Masterclass</p>
        
        <form action={enrollStudent} className="space-y-4">
          <input type="hidden" name="classId" value={musicClass.id} />
          <input name="studentName" placeholder="Student Name" className="w-full p-3 border rounded-xl" required />
          <input name="studentEmail" type="email" placeholder="Email" className="w-full p-3 border rounded-xl" required />
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">Join Class</button>
        </form>
      </div>
    </div>
  );
}
