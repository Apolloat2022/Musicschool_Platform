import { db } from "@/lib/db";
import { enrollments, musicClasses } from "@/lib/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, GraduationCap, Video, BookOpen, Music, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect("/student/login");
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const name = user.firstName ? `${user.firstName} ${user.lastName}` : (user.username || "Student");

    // Fetch enrollments for the student
    const studentEnrollments = await db.select().from(enrollments).where(eq(enrollments.studentEmail, email));

    // Extract class IDs
    const enrolledClassIds = studentEnrollments.map(e => e.classId).filter((id): id is number => id !== null);

    let enrolledClasses: any[] = [];
    if (enrolledClassIds.length > 0) {
        enrolledClasses = await db.select().from(musicClasses).where(inArray(musicClasses.id, enrolledClassIds));
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Header / Navbar */}
            <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
                    >
                        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">Back to Academy</span>
                    </Link>
                    <div className="font-bold text-xl tracking-tight hidden sm:block">
                        Apollo <span className="text-indigo-500">Academy</span> Student
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/schedule"
                            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition"
                        >
                            Explore Classes
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-600/20 rounded-3xl border border-indigo-500/20 shadow-inner">
                            <GraduationCap className="text-indigo-400" size={36} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Welcome back, {name}!</h1>
                            <p className="text-slate-400">Manage your enrollments, access live classrooms, and view assignments.</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grind */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Enrolled Classes */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen className="text-indigo-400" size={24} />
                            <h2 className="text-2xl font-bold text-white">Your Masterclasses</h2>
                        </div>

                        {enrolledClasses.length === 0 ? (
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl text-center">
                                <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex justify-center items-center mb-6">
                                    <Music className="text-slate-500" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">No active enrollments</h3>
                                <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                                    You haven't enrolled in any music classes yet. Explore our premier schedule and join a session today to start your musical journey.
                                </p>
                                <Link
                                    href="/schedule"
                                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-xl shadow-indigo-600/20 active:scale-95"
                                >
                                    View Live Schedule
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {enrolledClasses.map((c) => (
                                    <div key={c.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full">
                                        <div className="p-6 flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-indigo-500/20">
                                                    {c.instrument}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{c.title}</h3>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                                <Calendar size={14} className="text-slate-500" />
                                                <span>{c.dayOfWeek}s at {c.startTime}</span>
                                            </div>
                                            <p className="text-slate-400 text-sm">Instructor: <span className="text-slate-300">{c.teacherName || "Academy Faculty"}</span></p>
                                        </div>
                                        <div className="p-6 pt-0 mt-auto flex flex-col gap-3">
                                            <Link
                                                href={`/classroom/${c.id}`}
                                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm active:scale-[0.98]"
                                            >
                                                <Video size={16} /> Connect to Live Class
                                            </Link>
                                            {c.googleCourseId && (
                                                <a
                                                    href={`https://classroom.google.com/c/${c.googleCourseId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold px-4 py-3 rounded-xl transition text-sm active:scale-[0.98]"
                                                >
                                                    <BookOpen size={16} /> Open Google Classroom
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Mini Schedule or Quick Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link href="/schedule" className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl hover:bg-indigo-500/10 transition border border-slate-800 hover:border-indigo-500/30 group">
                                    <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-indigo-500/20 transition text-slate-400 group-hover:text-indigo-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-300 group-hover:text-white transition">Enroll in more classes</p>
                                        <p className="text-xs text-slate-500">View the master schedule</p>
                                    </div>
                                </Link>
                                <a href="https://classroom.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl hover:bg-indigo-500/10 transition border border-slate-800 hover:border-indigo-500/30 group">
                                    <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-indigo-500/20 transition text-slate-400 group-hover:text-indigo-400">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-300 group-hover:text-white transition">All Assignments</p>
                                        <p className="text-xs text-slate-500">Google Classroom Hub</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 backdrop-blur-xl border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 text-indigo-500/10">
                                <Music size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                                <p className="text-sm text-indigo-200/70 mb-6 leading-relaxed">
                                    Experiencing technical difficulties with live classes or your account? Support is available 24/7.
                                </p>
                                <button className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1">
                                    Contact Support &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-12 text-center border-t border-slate-900 mt-12">
                <p className="text-slate-500 text-sm">
                    © 2025 Apollo Music Academy • <span className="text-slate-400">Excellence in Performance</span>
                </p>
            </footer>
        </main>
    );
}
