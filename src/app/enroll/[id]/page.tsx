import { db } from "@/lib/db";
import { musicClasses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CheckoutButton from "@/components/CheckoutButton";
import { currentUser } from "@clerk/nextjs/server";
import { PRODUCTS } from "@/lib/pricing";

export default async function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  
  // Try to find the class
  const data = await db.select().from(musicClasses).where(eq(musicClasses.id, parseInt(id)));
  const musicClass = data[0];

  // If the ID doesn't exist in the DB, Next.js shows the 404/notFound page
  if (!musicClass) notFound();

  // Price is sourced from the server-side catalog (single source of truth,
  // and the same value the checkout API charges — the client cannot change it).
  // Future: make this a per-class column on musicClasses instead of a flat rate.
  const classPriceCents = PRODUCTS.class_enrollment.priceCents;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-950/80 backdrop-blur-xl text-white border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Masterclass Enrollment
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">{musicClass.title}</h1>
          <p className="text-slate-400 mb-8">{musicClass.instrument} • Led by {musicClass.teacherName}</p>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 font-medium">Class Fee</span>
              <span className="text-white font-bold">${(classPriceCents / 100).toFixed(2)}</span>
            </div>
            <div className="w-full h-px bg-slate-800 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Total Due</span>
              <span className="text-2xl font-bold text-emerald-400">${(classPriceCents / 100).toFixed(2)}</span>
            </div>
          </div>
          
          {user ? (
             <CheckoutButton
                mode="payment"
                productKey="class_enrollment"
                metadata={{ classId: musicClass.id.toString() }}
                label="Pay & Enroll Now"
                icon={true}
                className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex justify-center items-center gap-2"
             />
          ) : (
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-4">You must be logged in to enroll.</p>
              <a href="/student/login" className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
                Sign In to Continue
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
