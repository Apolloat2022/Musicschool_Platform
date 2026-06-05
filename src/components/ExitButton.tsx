"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

interface ExitButtonProps {
    subscriptionId: number;
}

export default function ExitButton({ subscriptionId }: ExitButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleExit = async () => {
        if (!confirm("Are you sure you want to exit your subscription? Your access will continue until the end of the current billing cycle.")) return;
        
        try {
            setIsLoading(true);
            const response = await fetch("/api/subscriptions/exit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId, note: "User initiated exit via Dashboard" }),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const text = await response.text();
                throw new Error(text);
            }
        } catch (error) {
            console.error("Exit request failed:", error);
            alert("Failed to process exit request. Please contact support.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Exit Requested</span>;
    }

    return (
        <button 
            onClick={handleExit} 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-transparent border border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500/50 text-rose-400 font-bold rounded-xl transition flex justify-center items-center gap-2 text-sm"
        >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
            Request Exit
        </button>
    );
}
