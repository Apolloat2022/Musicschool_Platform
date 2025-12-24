import Link from "next/link";
import { Music } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <Music className="w-16 h-16 text-indigo-400 mb-6" />
      <h1 className="text-5xl font-bold mb-4 text-center">Music Masterclass Platform</h1>
      <p className="text-slate-400 mb-8 text-xl">High-fidelity group lessons for musicians.</p>
      <div className="flex gap-4">
        <Link href="/admin" className="bg-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
          Teacher Dashboard
        </Link>
      </div>
    </div>
  );
}
