import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ClassroomView from "@/components/ClassroomView";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAcademyRole } from "@/lib/auth-utils";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();

  const musicClass = await db.query.musicClasses.findFirst({
    where: eq(musicClasses.id, parseInt(id))
  });

  if (!musicClass) notFound();

  // 1. Determine User Role using shared utility
  const role = await getAcademyRole(user, musicClass.id);

  const mockUser = {
    id: user?.id || `guest-${Math.random().toString(36).substring(7)}`,
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.username || "Guest Student"),
    email: user?.emailAddresses[0]?.emailAddress || "",
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <ClassroomView
        user={mockUser}
        classData={{
          title: musicClass.title,
          instrument: musicClass.instrument || "General",
          roomName: musicClass.jitsiRoomName || `classroom-${id}`,
          googleCourseId: musicClass.googleCourseId || undefined,
          zoomMeetingNumber: musicClass.zoomMeetingNumber || undefined,
        }}
        role={role}
      />
    </div>
  );
}
