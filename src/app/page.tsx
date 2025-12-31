import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Music, Sparkles, Award } from "lucide-react";

const programs = [
  {
    title: "The Introductory Series",
    description: "Start your musical journey with foundational techniques and core principles designed for absolute beginners.",
    image: "/images/intro.png",
    icon: Music,
    tag: "Fundamentals",
  },
  {
    title: "Core Development",
    description: "Refine your skills, master complex rhythms, and build performance confidence through intermediate-level study.",
    image: "/images/core.png",
    icon: Sparkles,
    tag: "Intermediate",
  },
  {
    title: "The Masterclass Series",
    description: "Join world-renowned virtuosos for advanced performance techniques, expressive theory, and professional polish.",
    image: "/images/masterclass.png",
    icon: Award,
    tag: "Advanced",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-12 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-500/10">
              <Image
                src="/logo.png"
                alt="Apollo Music Academy"
                width={80}
                height={80}
                className="rounded-xl"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Apollo <span className="text-indigo-500">Music</span> Academy
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Elevate your musicality with our signature learning tiers.
            Choose your path and begin your transformation today.
          </p>
        </div>
      </div>

      {/* Program Selection Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-400/30">
                    {program.tag}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <program.icon size={20} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition">
                    {program.title}
                  </h2>
                </div>

                <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                  {program.description}
                </p>

                <Link
                  href="/schedule"
                  className="group/btn flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                >
                  View Schedule
                  <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="py-12 text-center border-t border-slate-900">
        <p className="text-slate-500 text-sm mb-4">
          © 2025 Apollo Music Academy • <span className="text-slate-400">Excellence in Performance</span>
        </p>
        <Link
          href="/faculty/dashboard"
          className="text-slate-600 hover:text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-bold transition-all"
        >
          Faculty Portal
        </Link>
      </footer>
    </main>
  );
}