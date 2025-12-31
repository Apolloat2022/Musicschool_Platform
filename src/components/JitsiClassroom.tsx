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
    const [error, setError] = useState<string | null>(null);
    const appId = process.env.NEXT_PUBLIC_JITSI_APP_ID;

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!token && !error) {
                setError("Initialization timed out. This usually happens if the server action hangs or API keys are improperly configured.");
            }
        }, 15000); // 15 second timeout

        async function fetchToken() {
            try {
                const result = await getJitsiToken(roomName, userName, userEmail);
                if (result.error) {
                    setError(result.error);
                } else if (result.token) {
                    setToken(result.token);
                } else {
                    setError("No token received from server.");
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
            }
        }
        fetchToken();

        return () => clearTimeout(timeout);
    }, [roomName, userName, userEmail]);

    if (error) {
        return (
            <div className="w-full h-[600px] bg-red-950/20 border-2 border-red-500/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-red-400 mb-2">Classroom Secure Lock-out</h3>
                <p className="text-red-300/70 max-w-md">{error}</p>
            </div>
        );
    }

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
