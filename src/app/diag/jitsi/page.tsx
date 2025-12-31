"use client";

import { useState } from "react";
import { getJitsiToken } from "@/app/actions/jitsi";

export default function JitsiDiag() {
    const [status, setStatus] = useState<string>("Ready");
    const [result, setResult] = useState<any>(null);

    async function runTest() {
        setStatus("Running...");
        try {
            const res = await getJitsiToken("health-check", "Diagnostic Tool", "diag@test.com");
            setResult(res);
            setStatus("Finished");
        } catch (e: any) {
            setResult({ error: e.message });
            setStatus("Caught Exception");
        }
    }

    async function runFullTest() {
        setStatus("Running Full Sign...");
        try {
            const res = await getJitsiToken("test-room", "Diagnostic Tool", "diag@test.com");
            setResult(res);
            setStatus("Finished Full Sign");
        } catch (e: any) {
            setResult({ error: e.message });
            setStatus("Caught Exception");
        }
    }

    return (
        <div className="p-10 bg-slate-900 min-h-screen text-white font-mono">
            <h1 className="text-2xl font-bold mb-4">Jitsi Diagnostic Tool</h1>
            <div className="space-x-4 mb-4">
                <button onClick={runTest} className="px-4 py-2 bg-blue-600 rounded">Run Health Check (Fast)</button>
                <button onClick={runFullTest} className="px-4 py-2 bg-green-600 rounded">Run Full Signing (Requires Keys)</button>
            </div>
            <div className="mb-2">Status: <span className="text-yellow-400">{status}</span></div>
            <pre className="p-4 bg-black rounded border border-slate-700 overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
            </pre>
            <div className="mt-8">
                <p className="text-sm text-slate-400">If "Run Health Check" returns "health-ok" instantly, your server is connected.</p>
                <p className="text-sm text-slate-400">If "Run Full Signing" hangs for 12s and then shows an error, there is a bottleneck in the signing logic or keys.</p>
            </div>
        </div>
    );
}
