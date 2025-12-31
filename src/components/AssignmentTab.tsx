"use client";

import { useState, useEffect } from "react";
import { getAssignmentsAction } from "@/app/actions/google-classroom";
import { BookOpen, Calendar, ExternalLink, Loader2, Music } from "lucide-react";

interface AssignmentTabProps {
    courseId: string;
}

export default function AssignmentTab({ courseId }: AssignmentTabProps) {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadAssignments() {
            setLoading(true);
            const { assignments, error } = await getAssignmentsAction(courseId);
            if (error) {
                setError(error);
            } else {
                setAssignments(assignments);
            }
            setLoading(false);
        }

        if (courseId) {
            loadAssignments();
        }
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Fetching your lesson materials...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <BookOpen className="text-indigo-500" size={24} />
                <h2 className="text-2xl font-bold">Lesson Materials</h2>
            </div>

            {assignments.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                    <Music size={40} className="mx-auto text-slate-700 mb-2" />
                    <p className="text-slate-500">No materials posted yet. Check back later!</p>
                </div>
            ) : (
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

                            <div className="flex items-center gap-4">
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
        </div>
    );
}
