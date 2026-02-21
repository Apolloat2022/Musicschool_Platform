"use client";

import { Music, Mail, ArrowLeft, Phone, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-indigo-500/30">
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">

                    {/* Icon */}
                    <div className="flex justify-center mb-8 text-amber-500">
                        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner">
                            <ShieldAlert size={40} />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Password Reset</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Admin credentials are managed securely by your system administrator.
                        </p>
                    </div>

                    {!submitted ? (
                        <>
                            {/* Info box */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8 space-y-4">
                                <p className="text-amber-300 text-sm font-semibold flex items-start gap-2">
                                    <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                                    To reset the admin password, please contact one of the following:
                                </p>
                                <div className="space-y-3 pl-6">
                                    <a
                                        href="mailto:revanaglobal@gmail.com"
                                        className="flex items-center gap-3 text-sm text-slate-300 hover:text-indigo-400 transition-colors group"
                                    >
                                        <Mail size={16} className="text-indigo-400 shrink-0" />
                                        <span className="group-hover:underline">revanaglobal@gmail.com</span>
                                    </a>
                                    <a
                                        href="mailto:pandey201@yahoo.com"
                                        className="flex items-center gap-3 text-sm text-slate-300 hover:text-indigo-400 transition-colors group"
                                    >
                                        <Mail size={16} className="text-indigo-400 shrink-0" />
                                        <span className="group-hover:underline">pandey201@yahoo.com</span>
                                    </a>
                                </div>
                            </div>

                            <button
                                onClick={() => setSubmitted(true)}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                            >
                                I've Sent a Request
                            </button>
                        </>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3 mb-6">
                            <div className="text-4xl">✅</div>
                            <p className="text-emerald-400 font-bold">Request Noted</p>
                            <p className="text-slate-400 text-sm">
                                The system administrator will update your credentials and notify you. This typically takes less than 24 hours.
                            </p>
                        </div>
                    )}

                    {/* Back link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-400 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Back to Admin Login
                        </Link>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-600 text-xs tracking-widest uppercase font-bold">
                    © 2025 Apollo Music Academy • Protected Resource
                </p>
            </div>
        </div>
    );
}
