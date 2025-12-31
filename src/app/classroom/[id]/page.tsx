import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ClassroomView from "@/components/ClassroomView";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();

  const musicClass = await db.query.musicClasses.findFirst({
    where: eq(musicClasses.id, parseInt(id))
  });

  if (!musicClass) notFound();

  // In a real app, you would check the database for the user's subscription status
  const mockUser = {
    id: user?.id || "anonymous",
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "Student",
    email: user?.emailAddresses[0]?.emailAddress || "",
    isPremium: true // Toggle based on your business logic
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
      />
    </div>
  );
}
