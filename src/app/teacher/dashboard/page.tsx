import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { musicClasses, enrollments, attendance } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Users, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import MarkAttendanceButton from "./MarkAttendanceButton";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect("/teacher/login");
    }

    const name = user.firstName || "Teacher";

    // Fetch classes taught by this teacher (using name for now, or could be relation)
    // For MVP, fetch all classes where teacherName matches, or just all classes if it's the main instructor
    const classes = await db.query.musicClasses.findMany({
        with: {
            enrollments: true
        }
    });

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
            {/* Header */}
            <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/20">
                            A
                        </div>
                        <span className="font-bold text-xl tracking-tight">Apollo <span className="text-emerald-500">Academy</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 font-medium hidden md:block">Instructor Portal</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-white mb-2">Welcome back, {name}</h1>
                <p className="text-slate-400 text-lg mb-10">Manage your class rosters and log student learning hours.</p>

                <div className="space-y-6">
                    {classes.map((cls) => (
                        <div key={cls.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        {cls.title}
                                    </h2>
                                    <p className="text-slate-400 flex items-center gap-2 mt-2">
                                        <Clock size={16} /> {cls.dayOfWeek} at {cls.startTime}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-blue-500/10 text-blue-400 font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                                        <Users size={18} /> {cls.enrollments.length} Enrolled
                                    </span>
                                </div>
                            </div>

                            {cls.enrollments.length > 0 ? (
                                <div className="space-y-3">
                                    {cls.enrollments.map((enroll) => (
                                        <div key={enroll.id} className="flex items-center justify-between bg-slate-950/50 border border-slate-800 p-4 rounded-2xl">
                                            <div>
                                                <div className="font-bold text-white text-lg">{enroll.studentName}</div>
                                                <div className="text-sm text-slate-500">{enroll.studentEmail}</div>
                                            </div>
                                            <div>
                                                <MarkAttendanceButton enrollmentId={enroll.id} classId={cls.id} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No students currently enrolled in this class.</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
