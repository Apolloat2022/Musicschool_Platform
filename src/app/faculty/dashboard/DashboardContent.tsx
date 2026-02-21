"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    syncRosterAction,
    postHomeworkAction,
    postNoteAction,
    linkCourseIdAction,
} from "@/app/actions/google-classroom";
import { createClass } from "@/lib/actions";
import {
    Users,
    Send,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    LayoutDashboard,
    GraduationCap,
    Link2,
    FileText,
} from "lucide-react";

interface MusicClass {
    id: number;
    title: string;
    googleCourseId: string | null;
}

interface FacultyDashboardProps {
    classes: MusicClass[];
}

type Tab = "sync" | "notes" | "schedule";
type MsgState = { type: "success" | "error"; text: string } | null;

export default function FacultyDashboard({ classes }: FacultyDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>("sync");
    const [msg, setMsg] = useState<MsgState>(null);

    // ── Google Sync tab ──────────────────────────────────────────────
    const [courseId, setCourseId] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [roster, setRoster] = useState<any[]>([]);

    // Homework form
    const [hwTitle, setHwTitle] = useState("");
    const [hwDesc, setHwDesc] = useState("");
    const [hwLink, setHwLink] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    // Link Course form
    const [linkClassId, setLinkClassId] = useState<string>("");
    const [linkCourseInput, setLinkCourseInput] = useState("");
    const [isLinking, setIsLinking] = useState(false);

    // ── Notes tab ────────────────────────────────────────────────────
    const [noteClassId, setNoteClassId] = useState<string>("");
    const [noteTitle, setNoteTitle] = useState("");
    const [noteText, setNoteText] = useState("");
    const [isPostingNote, setIsPostingNote] = useState(false);

    // Pre-fill link course ID if a class already has one
    useEffect(() => {
        if (linkClassId) {
            const cls = classes.find((c) => c.id === parseInt(linkClassId));
            setLinkCourseInput(cls?.googleCourseId || "");
        }
    }, [linkClassId, classes]);

    const flash = (type: "success" | "error", text: string) => {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 5000);
    };

    const handleSync = async () => {
        if (!courseId) return flash("error", "Please enter a Course ID");
        setIsSyncing(true);
        const { students, error } = await syncRosterAction(courseId);
        if (error) flash("error", error);
        else {
            setRoster(students);
            flash("success", `Synced ${students.length} student(s).`);
        }
        setIsSyncing(false);
    };

    const handlePostHomework = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId) return flash("error", "Enter a Course ID first.");
        setIsPosting(true);
        const { error } = await postHomeworkAction(courseId, {
            title: hwTitle,
            description: hwDesc,
            link: hwLink || "https://apollotunes.com/practice",
        });
        if (error) flash("error", error);
        else {
            flash("success", "Homework posted to Google Classroom!");
            setHwTitle(""); setHwDesc(""); setHwLink("");
        }
        setIsPosting(false);
    };

    const handleLinkCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkClassId || !linkCourseInput) return flash("error", "Select a class and enter a Course ID.");
        setIsLinking(true);
        const { error } = await linkCourseIdAction(parseInt(linkClassId), linkCourseInput);
        if (error) flash("error", error);
        else flash("success", "Google Course ID linked to class!");
        setIsLinking(false);
    };

    const handlePostNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteClassId) return flash("error", "Select a class first.");
        const selectedClass = classes.find((c) => c.id === parseInt(noteClassId));
        if (!selectedClass?.googleCourseId) return flash("error", "Selected class has no linked Google Course ID. Link it first in the Google Sync tab.");
        setIsPostingNote(true);
        const { error } = await postNoteAction(selectedClass.googleCourseId, {
            title: noteTitle,
            text: noteText,
        });
        if (error) flash("error", error);
        else {
            flash("success", "Note posted to Google Classroom!");
            setNoteTitle(""); setNoteText("");
        }
        setIsPostingNote(false);
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "sync", label: "Google Sync", icon: <RefreshCw size={15} /> },
        { id: "notes", label: "Post Notes", icon: <FileText size={15} /> },
        { id: "schedule", label: "Live Schedule", icon: <LayoutDashboard size={15} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                        <GraduationCap className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Faculty Console</h1>
                        <p className="text-slate-400">Manage rosters, notes, and live sessions.</p>
                    </div>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 gap-1">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { setActiveTab(t.id); setMsg(null); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === t.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            {t.icon}{t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Global message toast */}
            {msg && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${msg.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    {msg.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{msg.text}</p>
                </div>
            )}

            {/* ── GOOGLE SYNC TAB ─────────────────────────────────────── */}
            {activeTab === "sync" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-1 space-y-6">
                        {/* Roster Sync */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <RefreshCw className="text-indigo-400" size={20} />
                                Roster Sync
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
                        </div>

                        {/* Roster list */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Users className="text-indigo-400" size={20} />
                                Current Roster
                            </h2>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {roster.length > 0 ? roster.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                            {s.profile.name.fullName[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">{s.profile.name.fullName}</p>
                                            <p className="text-[10px] text-slate-500">{s.profile.emailAddress}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-600 text-sm italic">No students synced yet.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {/* Post Homework */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                <Send className="text-indigo-400" size={24} />
                                Post Homework Assignment
                            </h2>
                            <form onSubmit={handlePostHomework} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Assignment Title</label>
                                            <input type="text" required value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} placeholder="e.g. Weekly Scale Practice" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Practice Link (Optional)</label>
                                            <input type="url" value={hwLink} onChange={(e) => setHwLink(e.target.value)} placeholder="https://apollotunes.com/..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Instructions</label>
                                        <textarea required value={hwDesc} onChange={(e) => setHwDesc(e.target.value)} placeholder="Describe the practice goals for this week..." rows={6} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition resize-none" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={isPosting} className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50">
                                        {isPosting ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                        Post to Google Classroom
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Link Course ID to DB class */}
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Link2 className="text-emerald-400" size={20} />
                                Link Google Course to Class
                            </h2>
                            <p className="text-slate-500 text-sm mb-6">Connect a Google Classroom course to a class in your schedule so students can access materials directly from their classroom page.</p>
                            <form onSubmit={handleLinkCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Class</label>
                                    <select
                                        value={linkClassId}
                                        onChange={(e) => setLinkClassId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition"
                                        required
                                    >
                                        <option value="">Select a class…</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title}{c.googleCourseId ? ` ✓` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Google Course ID</label>
                                    <input
                                        type="text"
                                        value={linkCourseInput}
                                        onChange={(e) => setLinkCourseInput(e.target.value)}
                                        placeholder="e.g. 123456789"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <button type="submit" disabled={isLinking} className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
                                        {isLinking ? <RefreshCw className="animate-spin" size={16} /> : <Link2 size={16} />}
                                        Link Course
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── NOTES TAB ───────────────────────────────────────────── */}
            {activeTab === "notes" && (
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <FileText className="text-indigo-400" size={24} />
                            Post a Note
                        </h2>
                        <p className="text-slate-500 text-sm mb-8">Notes are published as announcements in Google Classroom and are visible to all enrolled students immediately.</p>
                        <form onSubmit={handlePostNote} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Class</label>
                                <select
                                    value={noteClassId}
                                    onChange={(e) => setNoteClassId(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition"
                                    required
                                >
                                    <option value="">Select a class…</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title}{c.googleCourseId ? "" : " (no course linked)"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                    placeholder="e.g. This week's sheet music"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Note Body</label>
                                <textarea
                                    required
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Write your note, reminders, or links here…"
                                    rows={7}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" disabled={isPostingNote} className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50">
                                    {isPostingNote ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                    Publish Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── SCHEDULE TAB ────────────────────────────────────────── */}
            {activeTab === "schedule" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-400">
                                <RefreshCw size={20} />
                                Schedule New Class
                            </h2>
                            <form action={createClass} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Class Title</label>
                                    <input name="title" placeholder="e.g. Masterclass Piano" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Instrument</label>
                                    <input name="instrument" placeholder="Piano, Guitar..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Day</label>
                                        <input name="dayOfWeek" placeholder="Monday" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Time</label>
                                        <input name="startTime" type="time" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition" required />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-amber-600/20 active:scale-95">
                                    Create Class Session
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl h-full">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                <LayoutDashboard className="text-indigo-400" size={24} />
                                Active Live Sessions
                            </h2>
                            <div className="text-center py-12">
                                <p className="text-slate-500 italic mb-4">View and manage your scheduled live sessions.</p>
                                <Link href="/admin" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition">
                                    Open Advanced Schedule Manager
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
