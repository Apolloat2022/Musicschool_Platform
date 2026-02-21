'use server'

import { Resend } from 'resend';
import WelcomeEmail from '@/components/WelcomeEmail';
import { db } from '@/lib/db';
import { musicClasses, enrollments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { setAdminSession, logoutAdmin } from '@/lib/auth-admin';

export async function logoutAction() {
  await logoutAdmin();
  redirect('/');
}

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

export async function deleteClass(formData: FormData) {
  const classId = parseInt(formData.get('classId') as string);

  // Delete enrollments first (foreign key constraint)
  await db.delete(enrollments).where(eq(enrollments.classId, classId));
  // Then delete the class
  await db.delete(musicClasses).where(eq(musicClasses.id, classId));

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

  // 2. Send Welcome Email (only if RESEND_API_KEY is configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const [classInfo] = await db
        .select()
        .from(musicClasses)
        .where(eq(musicClasses.id, classId))
        .limit(1);

      await resend.emails.send({
        from: 'Music School <onboarding@resend.dev>',
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
    }
  } else {
    console.warn("RESEND_API_KEY not set — welcome email skipped.");
  }

  // 3. Redirect to Classroom
  redirect(`/classroom/${classId}`);
}

export async function loginAdmin(formData: FormData) {
  const user = formData.get('user') as string;
  const pass = formData.get('pass') as string;

  const EXPECTED_USER = process.env.ADMIN_USER || "admin";
  const EXPECTED_PASS = process.env.ADMIN_PASS || "apollo2025";

  if (user === EXPECTED_USER && pass === EXPECTED_PASS) {
    await setAdminSession(user);
    redirect('/admin');
  } else {
    redirect('/admin/login?error=Invalid credentials');
  }
}