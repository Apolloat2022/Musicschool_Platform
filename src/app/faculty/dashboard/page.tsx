import DashboardContent from "./DashboardContent";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function FacultyDashboardPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
                    >
                        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">Back to Portal</span>
                    </Link>
                    <div className="font-bold text-xl tracking-tight">
                        Apollo <span className="text-indigo-500">Academy</span> Faculty
                    </div>
                    <div className="w-24"></div>
                </div>
            </nav>

            <DashboardContent />

            <footer className="py-12 text-center border-t border-slate-900 mt-12">
                <p className="text-slate-500 text-sm">
                    © 2025 Apollo Music Academy • <span className="text-slate-400">Excellence in Performance</span>
                </p>
            </footer>
        </main>
    );
}
