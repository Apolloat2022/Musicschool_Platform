"use client";

import { useState } from "react";
import { syncRosterAction, postHomeworkAction } from "@/app/actions/google-classroom";
import {
    Users,
    Send,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    LayoutDashboard,
    GraduationCap
} from "lucide-react";

export default function FacultyDashboard() {
    const [courseId, setCourseId] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [roster, setRoster] = useState<any[]>([]);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Homework Form State
    const [hwTitle, setHwTitle] = useState("");
    const [hwDesc, setHwDesc] = useState("");
    const [hwLink, setHwLink] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const handleSync = async () => {
        if (!courseId) return setMsg({ type: "error", text: "Please enter a Course ID" });
        setIsSyncing(true);
        setMsg(null);
        const { students, error } = await syncRosterAction(courseId);
        if (error) {
            setMsg({ type: "error", text: error });
        } else {
            setRoster(students);
            setMsg({ type: "success", text: `Successfully synced ${students.length} students.` });
        }
        setIsSyncing(false);
    };

    const handlePostHomework = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId) return setMsg({ type: "error", text: "Sync a course before posting homework." });

        setIsPosting(true);
        const { error } = await postHomeworkAction(courseId, {
            title: hwTitle,
            description: hwDesc,
            link: hwLink || "https://apollotunes.com/practice"
        });

        if (error) {
            setMsg({ type: "error", text: error });
        } else {
            setMsg({ type: "success", text: "Homework posted successfully to Google Classroom!" });
            setHwTitle("");
            setHwDesc("");
            setHwLink("");
        }
        setIsPosting(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                    <GraduationCap className="text-white" size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Faculty Console</h1>
                    <p className="text-slate-400">Manage your academy rosters and sync with Google Classroom.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Sync & Roster */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <RefreshCw className="text-indigo-400" size={20} />
                            Classroom Sync
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Google Course ID</label>
                                <input
                                    type="text"
                                    value={courseId}
                                    onChange={(e) => setCourseId(e.target.value)}
                                    placeholder="Enter Course ID..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition"
                                />
                            </div>
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                            >
                                {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Users size={18} />}
                                Sync Roster
                            </button>
                        </div>

                        {msg && (
                            <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 border ${msg.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}>
                                {msg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                <p className="text-sm font-medium">{msg.text}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="text-indigo-400" size={20} />
                            Current Roster
                        </h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {roster.length > 0 ? roster.map((student, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                        {student.profile.name.fullName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight">{student.profile.name.fullName}</p>
                                        <p className="text-[10px] text-slate-500">{student.profile.emailAddress}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-600 text-sm italic">No students synced yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Homework Posting */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl h-full">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <Send className="text-indigo-400" size={24} />
                            Post Lesson Materials
                        </h2>

                        <form onSubmit={handlePostHomework} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Assignment Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={hwTitle}
                                            onChange={(e) => setHwTitle(e.target.value)}
                                            placeholder="e.g. Weekly Scale Practice"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Practice Link (Optional)</label>
                                        <input
                                            type="url"
                                            value={hwLink}
                                            onChange={(e) => setHwLink(e.target.value)}
                                            placeholder="https://apollotunes.com/..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Instructions</label>
                                    <textarea
                                        required
                                        value={hwDesc}
                                        onChange={(e) => setHwDesc(e.target.value)}
                                        placeholder="Describe the practice goals for this week..."
                                        rows={6}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isPosting}
                                    className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                                >
                                    {isPosting ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                    Post to Google Classroom
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
