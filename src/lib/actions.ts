'use server'

import { Resend } from 'resend';
import WelcomeEmail from '@/components/WelcomeEmail';
import { db } from '@/lib/db';
import { musicClasses, enrollments } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createClass(formData: FormData) {
  const title = formData.get('title') as string;
  const instrument = formData.get('instrument') as string;
  const dayOfWeek = formData.get('dayOfWeek') as string;
  const startTime = formData.get('startTime') as string;
  const jitsiRoomName = `MusicSchool-${Math.random().toString(36).substring(7)}`;

  await db.insert(musicClasses).values({
    title, instrument, dayOfWeek, startTime, jitsiRoomName,
  });

  revalidatePath('/admin');
}

export async function enrollStudent(formData: FormData) {
  const classId = parseInt(formData.get('classId') as string);
  const studentName = formData.get('studentName') as string;
  const studentEmail = formData.get('studentEmail') as string;

  // 1. Save to Database
  await db.insert(enrollments).values({
    classId, studentName, studentEmail
  });

  // 2. Send Welcome Email
  try {
    // Fetch class details for the email (optional - you could store this in the form if needed)
    const [classInfo] = await db.select().from(musicClasses).where({ id: classId }).limit(1);
    
    await resend.emails.send({
      from: 'Music School <onboarding@resend.dev>', // Update this with your domain
      to: [studentEmail],
      subject: 'Your Lesson Confirmation',
      react: WelcomeEmail({
        studentName,
        className: classInfo?.title || "Music Class",
        classroomUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/classroom/${classId}`
      }),
    });
  } catch (error) {
    console.error("Email failed to send, but student was enrolled:", error);
    // Don't throw here - we still want to redirect to classroom even if email fails
  }

  // 3. Redirect to Classroom
  redirect(`/classroom/${classId}`);
}