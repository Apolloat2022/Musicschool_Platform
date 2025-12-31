"use client";

import JitsiClassroom from "./JitsiClassroom";
import ZoomClassroom from "./ZoomClassroom";

interface User {
    id: string;
    name: string;
    email: string;
    isPremium: boolean;
}

interface ClassData {
    roomName: string;
    meetingNumber?: string;
    password?: string;
}

export default function SmartClassroom({ user, classData }: { user: User, classData: ClassData }) {
    if (user.isPremium) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        Premium Jitsi Classroom
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                        Unlimited Session
                    </span>
                </div>
                <JitsiClassroom
                    roomName={classData.roomName}
                    userName={user.name}
                    userEmail={user.email}
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                    30m Session Limit
                </span>
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
