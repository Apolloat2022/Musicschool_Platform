"use client";

import { useState } from "react";
import SmartClassroom, { UserRole } from "./SmartClassroom";
import AssignmentTab from "./AssignmentTab";
import { Video, BookOpen, Music, Users, Info } from "lucide-react";

interface ClassroomViewProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
    classData: {
        title: string;
        instrument: string;
        roomName: string;
        googleCourseId?: string;
        zoomMeetingNumber?: string;
    };
    role: UserRole;
}

export default function ClassroomView({ user, classData, role }: ClassroomViewProps) {
    const [activeTab, setActiveTab] = useState<"live" | "materials">("live");

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Header / Tab Navigation */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Music size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">{classData.title}</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{classData.instrument} Academy</p>
                    </div>
                </div>

                <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setActiveTab("live")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "live"
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        <Video size={16} />
                        Live Lesson
                    </button>
                    <button
                        onClick={() => setActiveTab("materials")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "materials"
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        <BookOpen size={16} />
                        Lesson Materials
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === "live" ? (
                    <div className="p-6 h-full">
                        <SmartClassroom
                            user={user}
                            classData={{
                                roomName: classData.roomName,
                                meetingNumber: classData.zoomMeetingNumber,
                            }}
                            role={role}
                        />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto p-8 w-full">
                        {classData.googleCourseId ? (
                            <AssignmentTab courseId={classData.googleCourseId} />
                        ) : (
                            <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                                <Info size={48} className="mx-auto text-slate-700 mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">Google Classroom Not Linked</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">
                                    Materials for this class are not currently synced with Google Classroom. Please contact your instructor.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
