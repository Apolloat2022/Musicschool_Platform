"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useEffect, useState } from "react";
import { getJitsiToken } from "@/app/actions/jitsi";

interface JitsiClassroomProps {
    roomName: string;
    userName: string;
    userEmail?: string;
}

export default function JitsiClassroom({ roomName, userName, userEmail }: JitsiClassroomProps) {
    const [token, setToken] = useState<string | null>(null);
    const appId = process.env.NEXT_PUBLIC_JITSI_APP_ID || "YOUR_APP_ID"; // Should be passed or in public env

    useEffect(() => {
        async function fetchToken() {
            const result = await getJitsiToken(roomName, userName, userEmail);
            if (result.token) setToken(result.token);
        }
        fetchToken();
    }, [roomName, userName, userEmail]);

    if (!token) {
        return (
            <div className="w-full h-[600px] bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center border border-slate-800">
                <p className="text-slate-400 font-medium">Initializing Secure Classroom...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-120px)] min-h-[600px] rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/20">
            <JitsiMeeting
                domain="8x8.vc"
                roomName={`${appId}/${roomName}`}
                jwt={token}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: false,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    // --- CRITICAL MUSIC SETTINGS ---
                    disableAudioLevels: true,
                    disableAP: true, // No noise suppression for instruments
                    disableHPF: true, // No high-pass filter
                    audioQuality: {
                        stereo: true,
                    },
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'chat',
                        'settings', 'raisehand', 'tileview', 'fullscreen'
                    ],
                }}
                userInfo={{
                    displayName: userName,
                    email: userEmail || ""
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = "100%";
                    iframeRef.style.width = "100%";
                }}
            />
        </div>
    );
}
