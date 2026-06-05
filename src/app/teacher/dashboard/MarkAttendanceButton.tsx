"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { logAttendance } from "./actions";

export default function MarkAttendanceButton({ enrollmentId, classId }: { enrollmentId: number, classId: number }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleMarkPresent = async () => {
        setStatus("loading");
        try {
            const res = await logAttendance(enrollmentId, classId, 60); // Standard 60 mins
            if (res.success) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <span className="flex items-center gap-2 text-emerald-400 font-bold px-4 py-2 bg-emerald-500/10 rounded-xl">
                <CheckCircle size={18} /> Marked Present (60m)
            </span>
        );
    }

    if (status === "error") {
        return (
            <span className="flex items-center gap-2 text-red-400 font-bold px-4 py-2 bg-red-500/10 rounded-xl">
                <AlertCircle size={18} /> Failed to log
            </span>
        );
    }

    return (
        <button
            onClick={handleMarkPresent}
            disabled={status === "loading"}
            className="flex items-center gap-2 bg-slate-800 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
            <CheckCircle size={18} />
            {status === "loading" ? "Logging..." : "Mark Present"}
        </button>
    );
}
