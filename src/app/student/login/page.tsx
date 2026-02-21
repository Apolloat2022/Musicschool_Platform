"use client";

import { SignIn } from "@clerk/nextjs";
import { Music, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudentLoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Branding header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-5">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner text-indigo-400">
                            <GraduationCap size={40} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Student Portal</h1>
                    <p className="text-slate-400 text-sm">Sign in to access your lessons and classroom.</p>
                </div>

                {/* Clerk Sign In — includes Remember Me & Forgot Password natively */}
                <div className="flex justify-center">
                    <SignIn
                        routing="hash"
                        afterSignInUrl="/"
                        appearance={{
                            variables: {
                                colorPrimary: "#6366f1",
                                colorBackground: "#0f172a",
                                colorInputBackground: "#1e293b",
                                colorInputText: "#f1f5f9",
                                colorText: "#f1f5f9",
                                colorTextSecondary: "#94a3b8",
                                fontFamily: "Inter, sans-serif",
                                borderRadius: "1rem",
                            },
                            elements: {
                                card: "bg-slate-900/40 backdrop-blur-2xl border border-slate-800 shadow-2xl rounded-3xl",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white",
                                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500",
                                footerActionLink: "text-indigo-400 hover:text-indigo-300",
                            },
                        }}
                    />
                </div>

                {/* Role switcher */}
                <div className="mt-8 flex flex-col items-center gap-3 text-sm text-slate-600">
                    <p>Not a student?</p>
                    <div className="flex gap-4">
                        <Link href="/teacher/login" className="text-slate-500 hover:text-indigo-400 font-semibold transition-colors">Teacher Login</Link>
                        <span className="text-slate-800">|</span>
                        <Link href="/parent/login" className="text-slate-500 hover:text-indigo-400 font-semibold transition-colors">Parent Login</Link>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors mt-1">
                        <ArrowLeft size={14} /> Back to Academy
                    </Link>
                </div>
            </div>
        </div>
    );
}
