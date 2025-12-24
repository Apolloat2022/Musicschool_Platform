import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import MusicClassroom from "@/components/MusicClassroom";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const musicClass = await db.query.musicClasses.findFirst({
    where: eq(musicClasses.id, parseInt(id))
  });

  if (!musicClass) notFound();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">{musicClass.title}</h1>
        <div className="text-sm bg-indigo-600 px-3 py-1 rounded">Live Lesson</div>
      </div>
      <div className="flex-1 relative">
        <MusicClassroom 
          roomName={musicClass.jitsiRoomName || "default-room"} 
          userName="Teacher" 
        />
      </div>
    </div>
  );
}
