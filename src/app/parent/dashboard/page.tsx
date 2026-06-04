import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Users,
    Calendar,
    CreditCard,
    TrendingUp,
    Bell,
    Settings,
    Music
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ParentDashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect("/parent/login");
    }

    const name = user.firstName || "Parent";

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
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
                        Apollo <span className="text-emerald-500">Academy</span> Parent
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-white transition">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-800 mx-2" />
                        <button className="p-2 text-slate-400 hover:text-white transition">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-emerald-600/20 rounded-3xl border border-emerald-500/20 shadow-inner">
                            <Users className="text-emerald-400" size={36} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Welcome, {name}!</h1>
                            <p className="text-slate-400">Monitor your children's progress and manage family enrollments.</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Children & Progress */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                        <TrendingUp size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-300">Learning Hours</h3>
                                </div>
                                <p className="text-3xl font-bold text-white">12.5 <span className="text-sm font-normal text-slate-500">this month</span></p>
                            </div>
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                        <Calendar size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-300">Upcoming Lessons</h3>
                                </div>
                                <p className="text-3xl font-bold text-white">4 <span className="text-sm font-normal text-slate-500">scheduled</span></p>
                            </div>
                        </div>

                        {/* Recent Activity Placeholder */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden p-8 text-center py-16">
                            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex justify-center items-center mb-6 text-slate-500">
                                <Music size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Activity & Progress</h2>
                            <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                                Detailed progress reports and lesson feedback will appear here once your children begin their classes.
                            </p>
                            <Link
                                href="/schedule"
                                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-xl shadow-emerald-600/20 active:scale-95"
                            >
                                Explore Programs
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Billing & Support */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <CreditCard size={20} className="text-emerald-400" />
                                Family Billing
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Next Payment</p>
                                    <p className="text-white font-bold">$0.00</p>
                                </div>
                                <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition text-sm">
                                    View Invoices
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-2">Concierge Support</h3>
                            <p className="text-sm text-emerald-200/70 mb-6 leading-relaxed">
                                Need assistance with scheduling or billing? Our priority support team is ready to help.
                            </p>
                            <button className="text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 group">
                                Open Ticket
                                <TrendingUp size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-12 text-center border-t border-slate-900 mt-12">
                <p className="text-slate-500 text-sm">
                    © 2025 Apollo Music Academy • <span className="text-slate-400">Family Excellence</span>
                </p>
            </footer>
        </main>
    );
}
