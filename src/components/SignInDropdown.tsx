"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function SignInDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative group" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
                Sign In
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : 'group-hover:rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl transition-all duration-200 z-50 overflow-hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                    }`}
            >
                <Link href="/student/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-4 hover:bg-indigo-500/10 text-slate-300 hover:text-white transition-colors border-b border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-bold">Student Portal</span>
                </Link>
                <Link href="/teacher/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-4 hover:bg-amber-500/10 text-slate-300 hover:text-white transition-colors border-b border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-bold">Teacher Portal</span>
                </Link>
                <Link href="/parent/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-4 hover:bg-emerald-500/10 text-slate-300 hover:text-white transition-colors">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-bold">Parent Portal</span>
                </Link>
            </div>
        </div>
    );
}
