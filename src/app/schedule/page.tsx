import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import ScheduleContent from "./ScheduleContent";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getAcademyRole } from "@/lib/auth-utils";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
    const classes = await db.select().from(musicClasses);
    const user = await currentUser();
    const role = await getAcademyRole(user);

    // Fetch enrollments for the current user to identify "Paid Students"
    let enrolledClassIds: number[] = [];
    if (user) {
        const userEmail = user.emailAddresses[0]?.emailAddress;
        if (userEmail) {
            const userEnrollments = await db.query.enrollments.findMany({
                where: (enrollments, { eq }) => eq(enrollments.studentEmail, userEmail)
            });
            enrolledClassIds = userEnrollments
                .map(e => e.classId)
                .filter((id): id is number => id !== null);
        }
    }

    const userData = user ? {
        id: user.id,
        name: user.firstName ? `${user.firstName} ${user.lastName}` : (user.username || "Academy Student"),
        email: user.emailAddresses[0]?.emailAddress || "",
    } : null;

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Navigation */}
            <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
                    >
                        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">Back to Programs</span>
                    </Link>
                    <div className="font-bold text-xl tracking-tight">
                        Apollo <span className="text-indigo-500">Academy</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-10 h-10 border-2 border-indigo-500/20"
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </nav>

            <ScheduleContent
                classes={classes}
                user={userData}
                globalRole={role}
                enrolledClassIds={enrolledClassIds}
            />

            <footer className="py-12 text-center border-t border-slate-900 mt-12">
                <p className="text-slate-500 text-sm">
                    © 2025 Apollo Music Academy • <span className="text-slate-400">Excellence in Performance</span>
                </p>
            </footer>
        </main>
    );
}
