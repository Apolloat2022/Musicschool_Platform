"use client";
import { useState, useEffect } from "react";
import JitsiClassroom from "./JitsiClassroom";
import ZoomClassroom from "./ZoomClassroom";

export type UserRole = "MODERATOR" | "STUDENT" | "GUEST";

interface User {
    id: string;
    name: string;
    email: string;
}

interface ClassData {
    roomName: string;
    meetingNumber?: string;
    password?: string;
}

export default function SmartClassroom({
    user,
    classData,
    role
}: {
    user: User,
    classData: ClassData,
    role: UserRole
}) {
    const [sessionTime, setSessionTime] = useState(0);

    useEffect(() => {
        // Run timer for everyone, but we only show it to moderators
        const interval = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // All authorized or trial users go to Jitsi now (Zoom SDK is unstable on React 19)
    return (
        <div className="space-y-4">
            <div className={`sticky top-0 z-10 py-2 backdrop-blur-md rounded-xl border border-white/5 mb-4 ${role === "MODERATOR" ? "bg-amber-950/20" :
                    role === "STUDENT" ? "bg-indigo-950/20" : "bg-blue-950/20"
                }`}>
                <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className={`w-2 h-2 ${role === "MODERATOR" ? "bg-amber-400" :
                                    role === "STUDENT" ? "bg-indigo-500" : "bg-blue-500"
                                } rounded-full animate-pulse`} />
                            {role === "MODERATOR" ? "Instructor Control Center" :
                                role === "STUDENT" ? "Premium Jitsi Classroom" : "Trial Jitsi Classroom"}
                        </h2>
                        <div className="flex items-center gap-3">
                            {role === "MODERATOR" && (
                                <span className="text-[10px] text-amber-400 font-mono mt-0.5 uppercase tracking-tighter">
                                    SESSION DURATION: {formatTime(sessionTime)}
                                </span>
                            )}
                            {role === "GUEST" && (
                                <span className="text-[10px] text-blue-400 font-bold mt-0.5 uppercase">
                                    Trial Timer: {formatTime(sessionTime)} / 30:00
                                </span>
                            )}
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${role === "MODERATOR" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                            role === "STUDENT" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" :
                                "text-blue-400 bg-blue-500/10 border-blue-500/20"
                        }`}>
                        {role === "MODERATOR" ? "Moderator Mode" :
                            role === "STUDENT" ? "Unlimited Session" : "30m Limit Applied"}
                    </span>
                </div>
            </div>

            <JitsiClassroom
                roomName={classData.roomName}
                userName={user.name}
                userId={user.id}
                userEmail={user.email}
                isModerator={role === "MODERATOR"}
            />
        </div>
    );
}
