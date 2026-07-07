import { school } from "@/config/school";

export const metadata = { title: `Privacy Policy — ${school.name}` };

// Generated legal page. Review with counsel before relying on it.
export default function PrivacyPolicyPage() {
    return (
        <main className="mx-auto max-w-3xl px-6 py-16 leading-relaxed">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-sm opacity-60 mb-10">{school.name} · Last updated: July 6, 2026</p>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold pt-4">Who we are</h2>
                <p>
                    {school.name} (&quot;we&quot;, &quot;us&quot;) operates this service. For any
                    privacy question or request, email{' '}
                    <a className="underline" href={`mailto:${school.contactEmail}`}>{school.contactEmail}</a>.
                </p>

                <h2 className="text-xl font-semibold pt-4">Information we collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li dangerouslySetInnerHTML={{ __html: "<strong>Account details</strong> — name and email address for parents, teachers, and students, managed through Clerk, our authentication provider." }} />
                    <li dangerouslySetInnerHTML={{ __html: "<strong>Enrollment and scheduling</strong> — the classes you enroll in, lesson schedules, and attendance." }} />
                    <li dangerouslySetInnerHTML={{ __html: "<strong>Payments</strong> — subscription and invoice records processed by Stripe. Card numbers go directly to Stripe; we never see or store them." }} />
                    <li dangerouslySetInnerHTML={{ __html: "<strong>Online classroom</strong> — live lessons run on Zoom or Jitsi. We do not record sessions; if that ever changes, participants will be told before recording starts." }} />
                    <li dangerouslySetInnerHTML={{ __html: "<strong>Emails</strong> — enrollment and billing emails sent via Resend." }} />
                </ul>

                <h2 className="text-xl font-semibold pt-4">How we use it</h2>
                <p>
                    We use this information only to provide the service: creating your account, delivering
                    the features you use, processing payments where applicable, and sending service emails.
                    We do not sell your information or use third-party advertising trackers.
                </p>

                <h2 className="text-xl font-semibold pt-4">Where it is stored</h2>
                <p>
                    The application is hosted on Vercel, and data is stored with the service providers named
                    above. These providers process data on our behalf under their own security and privacy
                    commitments.
                </p>

                <h2 className="text-xl font-semibold pt-4">Children</h2>
                <p>Students may be minors. Student accounts and enrollments are created and managed by a parent or guardian, who consents to the collection of the student’s information. Parents can review or delete their child’s information at any time by contacting us.</p>

                <h2 className="text-xl font-semibold pt-4">Your rights</h2>
                <p>
                    You can request a copy of your data, a correction, or deletion of your account and data
                    at any time by emailing{' '}
                    <a className="underline" href={`mailto:${school.contactEmail}`}>{school.contactEmail}</a>. We respond to verified
                    requests within 30 days.
                </p>

                <h2 className="text-xl font-semibold pt-4">Retention</h2>
                <p>
                    We keep your data for as long as your account exists, then delete it. Payment records may
                    be retained longer where tax or accounting law requires.
                </p>

                <h2 className="text-xl font-semibold pt-4">Changes</h2>
                <p>
                    If we make material changes to this policy, we will update the date above and, where
                    appropriate, notify you by email or in the app.
                </p>
            </section>
        </main>
    );
}
