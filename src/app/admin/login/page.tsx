"use client";

import { loginAdmin } from "@/lib/actions";
import { Lock, User, Music, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <form action={loginAdmin} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center animate-in fade-in zoom-in duration-300">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">User ID</label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        name="user"
                        type="text"
                        required
                        placeholder="Enter admin ID"
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner shadow-black/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        name="pass"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner shadow-black/20"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="group w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
                Authorize Access
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
        </form>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-indigo-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
                    <div className="flex justify-center mb-8 text-indigo-500">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
                            <Music size={40} />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Portal</h1>
                        <p className="text-slate-400">Please verify your credentials to continue.</p>
                    </div>

                    <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
                        <LoginForm />
                    </Suspense>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-sm text-slate-600 hover:text-indigo-400 transition-colors">
                            Return to Public Academy
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
