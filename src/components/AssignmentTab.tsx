"use client";

import { useState, useEffect } from "react";
import { getAssignmentsAction, getAnnouncementsAction } from "@/app/actions/google-classroom";
import {
    BookOpen,
    Calendar,
    ExternalLink,
    Loader2,
    Music,
    Megaphone,
    FileText,
} from "lucide-react";

interface AssignmentTabProps {
    courseId: string;
}

type SubTab = "homework" | "notes";

export default function AssignmentTab({ courseId }: AssignmentTabProps) {
    const [subTab, setSubTab] = useState<SubTab>("homework");

    // Homework state
    const [assignments, setAssignments] = useState<any[]>([]);
    const [hwLoading, setHwLoading] = useState(true);
    const [hwError, setHwError] = useState<string | null>(null);

    // Notes / announcements state
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [notesError, setNotesError] = useState<string | null>(null);

    useEffect(() => {
        if (!courseId) return;

        async function loadAll() {
            setHwLoading(true);
            setNotesLoading(true);

            const [hwResult, notesResult] = await Promise.all([
                getAssignmentsAction(courseId),
                getAnnouncementsAction(courseId),
            ]);

            if (hwResult.error) setHwError(hwResult.error);
            else setAssignments(hwResult.assignments);
            setHwLoading(false);

            if (notesResult.error) setNotesError(notesResult.error);
            else setAnnouncements(notesResult.announcements);
            setNotesLoading(false);
        }

        loadAll();
    }, [courseId]);

    const isLoading = subTab === "homework" ? hwLoading : notesLoading;

    return (
        <div className="space-y-6">
            {/* Sub-tab header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-indigo-500" size={24} />
                    <h2 className="text-2xl font-bold text-white">Lesson Materials</h2>
                </div>
                <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setSubTab("homework")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${subTab === "homework"
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        <FileText size={14} />
                        Homework
                    </button>
                    <button
                        onClick={() => setSubTab("notes")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${subTab === "notes"
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        <Megaphone size={14} />
                        Notes
                    </button>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p>Fetching {subTab === "homework" ? "assignments" : "notes"}…</p>
                </div>
            )}

            {/* ── HOMEWORK ─────────────────────────────────────────────── */}
            {subTab === "homework" && !hwLoading && (
                <>
                    {hwError && (
                        <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-center">
                            <p className="text-red-400">{hwError}</p>
                        </div>
                    )}
                    {!hwError && assignments.length === 0 && (
                        <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                            <Music size={40} className="mx-auto text-slate-700 mb-2" />
                            <p className="text-slate-500">No homework posted yet. Check back later!</p>
                        </div>
                    )}
                    {!hwError && assignments.length > 0 && (
                        <div className="grid gap-4">
                            {assignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                                            {assignment.title}
                                        </h3>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded">
                                            <Calendar size={12} />
                                            {new Date(assignment.creationTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                        {assignment.description || "Take a look at your latest practice materials."}
                                    </p>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {assignment.alternateLink && (
                                            <a
                                                href={assignment.alternateLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
                                            >
                                                View on Google Classroom
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                        {assignment.materials?.map((m: any, idx: number) => {
                                            if (m.link) {
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={m.link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                                                    >
                                                        Practice Material
                                                        <ExternalLink size={12} />
                                                    </a>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── NOTES ────────────────────────────────────────────────── */}
            {subTab === "notes" && !notesLoading && (
                <>
                    {notesError && (
                        <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-center">
                            <p className="text-red-400">{notesError}</p>
                        </div>
                    )}
                    {!notesError && announcements.length === 0 && (
                        <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                            <Megaphone size={40} className="mx-auto text-slate-700 mb-2" />
                            <p className="text-slate-500">No notes from your teacher yet. Check back soon!</p>
                        </div>
                    )}
                    {!notesError && announcements.length > 0 && (
                        <div className="grid gap-4">
                            {announcements.map((note) => (
                                <div
                                    key={note.id}
                                    className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Megaphone size={16} className="text-indigo-400 shrink-0" />
                                            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition leading-tight line-clamp-1">
                                                {note.text?.split("\n")[0]?.replace(/^\*\*(.+)\*\*$/, "$1") || "Note"}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded shrink-0 ml-2">
                                            <Calendar size={12} />
                                            {new Date(note.creationTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm whitespace-pre-line line-clamp-4">
                                        {note.text?.split("\n").slice(2).join("\n") || note.text}
                                    </p>
                                    {note.alternateLink && (
                                        <a
                                            href={note.alternateLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
                                        >
                                            View in Google Classroom
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
