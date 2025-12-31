"use client";

import { useEffect, useRef, useState } from "react";
import { getZoomSignature } from "@/app/actions/zoom";

interface ZoomClassroomProps {
    meetingNumber: string;
    userName: string;
    password?: string;
    role: number; // 0 for student, 1 for teacher
}

export default function ZoomClassroom({ meetingNumber, userName, password, role }: ZoomClassroomProps) {
    const zoomRootRef = useRef<HTMLDivElement>(null);
    const [client, setClient] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initZoom = async () => {
            try {
                // @ts-ignore
                const { default: ZoomMtgEmbedded } = await import("@zoom/meetingsdk/embedded");
                const clientInstance = ZoomMtgEmbedded.createClient();
                setClient(clientInstance);

                const { signature, error: sigError } = await getZoomSignature(meetingNumber, role);
                if (sigError) throw new Error(sigError);

                if (zoomRootRef.current) {
                    await clientInstance.init({
                        zoomAppRoot: zoomRootRef.current,
                        language: "en-US",
                    });

                    await clientInstance.join({
                        signature: signature!,
                        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
                        meetingNumber: meetingNumber,
                        password: password || "",
                        userName: userName,
                        userEmail: "",
                        tk: "",
                        // @ts-ignore
                        activeSetting: {
                            audio: {
                                // @ts-ignore
                                originalSound: true,
                                echoCancellation: true,
                                noiseSuppression: "low"
                            }
                        }
                    });

                    // Implement a 30-minute hard shutdown for trials
                    setTimeout(() => {
                        alert("This trial session has reached its 30-minute limit. Thank you for visiting Apollo Music Academy!");
                        // @ts-ignore
                        clientInstance.leaveMeeting();
                    }, 30 * 60 * 1000);
                }
            } catch (err: any) {
                console.error("Zoom SDK Error:", err);
                setError(err.message || "Failed to initialize Zoom.");
            }
        };

        initZoom();

        return () => {
            // Cleanup if needed
        };
    }, [meetingNumber, userName, password, role]);

    if (error) {
        return (
            <div className="p-10 bg-red-950/20 border-2 border-red-500/50 rounded-2xl text-center">
                <h3 className="text-xl font-bold text-red-400 mb-2">Classroom Connection Failed</h3>
                <p className="text-red-300/70">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[calc(100vh-120px)] bg-slate-950 rounded-2xl overflow-hidden border-2 border-blue-500/20 shadow-2xl">
            <div id="zoom-root" ref={zoomRootRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute top-4 right-4 z-50">
                <span className="px-3 py-1 bg-blue-600/20 backdrop-blur-md rounded-full text-xs font-bold text-blue-400 border border-blue-400/30">
                    Trial Session: 30m Limit
                </span>
            </div>
        </div>
    );
}
