"use client";

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
    const isAuthorized = role === "MODERATOR" || role === "STUDENT";

    if (isAuthorized) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className={`w-2 h-2 ${role === "MODERATOR" ? "bg-amber-400" : "bg-indigo-500"} rounded-full animate-pulse`} />
                        {role === "MODERATOR" ? "Instructor Classroom" : "Premium Jitsi Classroom"}
                    </h2>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${role === "MODERATOR" ? "text-amber-400 bg-amber-500/10" : "text-indigo-400 bg-indigo-500/10"} px-2 py-1 rounded`}>
                        {role === "MODERATOR" ? "Moderator Mode" : "Unlimited Session"}
                    </span>
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Trial Zoom Classroom
                </h2>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                        Enrollment Required for Jitsi
                    </span>
                    <span className="text-[9px] text-slate-500 italic">30m Session Limit</span>
                </div>
            </div>
            <ZoomClassroom
                meetingNumber={classData.meetingNumber || "123456789"}
                userName={user.name}
                password={classData.password}
                role={0} // Student for this view
            />
        </div>
    );
}
