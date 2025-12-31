"use client";

import { useState, useMemo } from "react";
import {
    Guitar,
    Music,
    Mic2,
    Volume2 as Violin,
    Speaker as Cello,
    ChevronRight,
    Clock,
    User,
    Calendar,
    Video
} from "lucide-react";
import Link from "next/link";
import SmartClassroom from "@/components/SmartClassroom";
import { UserRole } from "@/lib/auth-utils";

const instruments = [
    { name: "All", icon: Music },
    { name: "Guitar", icon: Guitar },
    { name: "Piano", icon: Music },
    { name: "Violin", icon: Violin },
    { name: "Cello", icon: Cello },
    { name: "Voice", icon: Mic2 },
];

const instructors = ["Sarah Jenkins", "Michael Chen", "Elena Rodriguez", "David Strauss", "Aria Smith"];

interface ScheduleContentProps {
    classes: any[];
    user: { id: string; name: string; email: string; } | null;
    globalRole: UserRole;
    enrolledClassIds: number[];
}

export default function ScheduleContent({ classes, user, globalRole, enrolledClassIds }: ScheduleContentProps) {
    const [selectedInstrument, setSelectedInstrument] = useState("All");
    const [activeClassroom, setActiveClassroom] = useState<any>(null);

    // Calculate role for the currently active classroom
    const getActiveRole = (clsId: number): UserRole => {
        if (globalRole === "MODERATOR") return "MODERATOR";
        if (enrolledClassIds.includes(clsId)) return "STUDENT";
        return "GUEST";
    };

    // Fallback for guest if user prop is null
    const currentUser = user || {
        id: `guest-${Math.random().toString(36).substring(7)}`,
        name: "Guest Student",
        email: "",
    };

    const filteredClasses = useMemo(() => {
        return classes.filter(cls =>
            selectedInstrument === "All" || (cls.instrument?.toLowerCase() || "") === selectedInstrument.toLowerCase()
        );
    }, [selectedInstrument, classes]);

    const getLevelInfo = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes("intro") || t.includes("beginner")) {
            return { label: "Intro", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
        }
        if (t.includes("master") || t.includes("advanced")) {
            return { label: "Masterclass", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
        }
        return { label: "Intermediate", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    };

    const getInstrumentIcon = (instrument: string | null) => {
        switch (instrument?.toLowerCase() || "") {
            case "guitar": return Guitar;
            case "violin": return Violin;
            case "cello": return Cello;
            case "voice": return Mic2;
            default: return Music;
        }
    };

    if (activeClassroom) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setActiveClassroom(null)}
                        className="text-slate-400 hover:text-white flex items-center gap-2 transition"
                    >
                        <ChevronRight className="rotate-180" size={18} />
                        Back to Schedule
                    </button>
                    <div className="text-right">
                        <h3 className="font-bold text-white">{activeClassroom.title}</h3>
                        <p className="text-xs text-slate-500">Instructor: {activeClassroom.instructor}</p>
                    </div>
                </div>
                <SmartClassroom
                    user={currentUser}
                    classData={{
                        roomName: activeClassroom.title.replace(/\s+/g, '-'),
                        meetingNumber: activeClassroom.zoomMeetingNumber || "123456789",
                        password: "test"
                    }}
                    role={getActiveRole(activeClassroom.id)}
                />
            </div>
        );
    }

    const enrolledClasses = useMemo(() => {
        return classes.filter(cls => enrolledClassIds.includes(cls.id));
    }, [classes, enrolledClassIds]);

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Upcoming Live Sessions</h1>
                    <p className="text-slate-400">Secure your spot in our upcoming expert-led virtual classrooms.</p>
                </div>

                <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 scrollbar-hide no-scrollbar">
                    {instruments.map((inst) => (
                        <button
                            key={inst.name}
                            onClick={() => setSelectedInstrument(inst.name)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all whitespace-nowrap ${selectedInstrument === inst.name
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                                }`}
                        >
                            <inst.icon size={16} />
                            <span className="text-sm font-medium">{inst.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* My Enrolled Classes Section */}
            {enrolledClasses.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px bg-indigo-500/30 flex-grow" />
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400 whitespace-nowrap">
                            My Enrolled Classes
                        </h2>
                        <div className="h-px bg-indigo-500/30 flex-grow" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {enrolledClasses.map((cls, idx) => {
                            const level = getLevelInfo(cls.title);
                            const Icon = getInstrumentIcon(cls.instrument);
                            const instructor = instructors[idx % instructors.length];

                            return (
                                <div
                                    key={`enrolled-${cls.id}`}
                                    className="group relative bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-indigo-500/40 transition-all"
                                >
                                    <div className="flex items-center gap-4 flex-grow w-full md:w-auto">
                                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{cls.title}</h3>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><User size={12} /> {instructor}</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {cls.dayOfWeek}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {cls.startTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveClassroom({ ...cls, instructor })}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center"
                                    >
                                        <Video size={16} />
                                        Join Class
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls, idx) => {
                        const level = getLevelInfo(cls.title);
                        const Icon = getInstrumentIcon(cls.instrument);
                        const instructor = instructors[idx % instructors.length];
                        const classRole = getActiveRole(cls.id);
                        const isEnrolled = enrolledClassIds.includes(cls.id);

                        return (
                            <div
                                key={cls.id}
                                className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 hover:border-indigo-500/30 transition-all duration-300"
                            >
                                <div className="flex items-center gap-6 flex-grow w-full md:w-auto">
                                    <div className="p-5 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                        <Icon size={32} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${level.color}`}>
                                                {level.label}
                                            </span>
                                            <span className="text-slate-500 text-xs flex items-center gap-1">
                                                <Calendar size={12} />
                                                {cls.dayOfWeek}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition">
                                            {cls.title}
                                        </h2>
                                        <div className="flex items-center gap-4 mt-3 text-slate-400 text-sm">
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} className="text-indigo-500/70" />
                                                {instructor}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-indigo-500/70" />
                                                {cls.startTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto shrink-0 flex flex-col gap-3 min-w-[200px]">
                                    <button
                                        onClick={() => setActiveClassroom({ ...cls, instructor })}
                                        className={`flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg w-full group/btn ${classRole === "MODERATOR"
                                            ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
                                            : classRole === "STUDENT"
                                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                                                : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30"
                                            }`}
                                    >
                                        <Video size={18} />
                                        {classRole === "MODERATOR" ? "Start Class" : classRole === "STUDENT" ? "Join Class" : "Try Trial Session"}
                                    </button>

                                    {!isEnrolled && classRole !== "MODERATOR" && (
                                        <Link
                                            href={`/enroll/${cls.id}`}
                                            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-8 py-3 rounded-xl transition-all duration-300 w-full"
                                        >
                                            Secure Your Spot
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                        <Music size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500">No sessions found for {selectedInstrument}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

