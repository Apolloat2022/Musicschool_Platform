"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useEffect, useState } from "react";
import { getJitsiToken } from "@/app/actions/jitsi";

interface JitsiClassroomProps {
    roomName: string;
    userName: string;
    userId: string;
    userEmail?: string;
    isModerator?: boolean;
}

export default function JitsiClassroom({ roomName, userName, userId, userEmail, isModerator = false }: JitsiClassroomProps) {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const appId = process.env.NEXT_PUBLIC_JITSI_APP_ID;

    useEffect(() => {
        console.log(`[Jitsi] Initializing for room: ${roomName}, user: ${userName} (${userId})`);

        const timeout = setTimeout(() => {
            if (!token && !error) {
                console.warn("[Jitsi] 45s timeout reached without response.");
                setError("The secure classroom took too long to initialize. This could be a temporary server delay. Please try refreshing the page.");
            }
        }, 45000);

        async function fetchToken() {
            try {
                console.log("[Jitsi] Requesting token from server...");
                // Pass userId to server action
                const result = await getJitsiToken(roomName, userName, userId, userEmail, isModerator);

                if (result.error) {
                    console.error("[Jitsi] Server returned error:", result.error);
                    setError(`Server Error: ${result.error}`);
                } else if (result.token) {
                    console.log("[Jitsi] Token received successfully.");
                    setToken(result.token);
                } else {
                    setError("Communication failure: No security token received.");
                }
            } catch (err: any) {
                console.error("[Jitsi] Network or Fetch error:", err);
                setError(`Network Error: ${err.message || "Failed to contact classroom server."}`);
            }
        }
        fetchToken();

        return () => clearTimeout(timeout);
    }, [roomName, userName, userId, userEmail]);

    if (error) {
        return (
            <div className="w-full h-[600px] bg-red-950/20 border-2 border-red-500/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-red-400 mb-2">Classroom Secure Lock-out</h3>
                <p className="text-red-300/70 max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-colors"
                >
                    Retry Connection
                </button>
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
