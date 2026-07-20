import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Runnerx",
  description: "Get in touch with the Runnerx team for support, partnerships, or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-lg py-3xl space-y-2xl">
      <section className="text-center space-y-md">
        <h1 className="font-sans text-4xl md:text-5xl font-black text-on-surface">Contact Us</h1>
        <p className="font-mono text-sm text-on-surface-variant">
          We&apos;d love to hear from you. Reach out for support, partnerships, or feedback.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="bg-surface border border-outline-variant rounded-xl p-lg space-y-sm">
          <span className="material-symbols-outlined text-2xl text-primary">mail</span>
          <h3 className="font-sans text-lg font-semibold text-on-surface">Email</h3>
          <p className="font-mono text-sm text-primary">admins@bitshiftdevs.com</p>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-lg space-y-sm">
          <span className="material-symbols-outlined text-2xl text-primary">location_on</span>
          <h3 className="font-sans text-lg font-semibold text-on-surface">Location</h3>
          <p className="font-mono text-sm text-on-surface-variant">Kumasi, Ghana</p>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-lg space-y-sm">
          <span className="material-symbols-outlined text-2xl text-primary">schedule</span>
          <h3 className="font-sans text-lg font-semibold text-on-surface">Support Hours</h3>
          <p className="font-mono text-sm text-on-surface-variant">Mon–Fri: 8AM – 8PM GMT</p>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-lg space-y-sm">
          <span className="material-symbols-outlined text-2xl text-primary">chat</span>
          <h3 className="font-sans text-lg font-semibold text-on-surface">In-App Support</h3>
          <p className="font-mono text-sm text-on-surface-variant">Use the help section in the mobile app</p>
        </div>
      </div>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl space-y-md text-center">
        <h2 className="font-sans text-xl font-bold text-on-surface">For Business & Partnerships</h2>
        <p className="font-mono text-sm text-on-surface-variant">
          Interested in partnering with Runnerx or bringing us to your campus? Email us at:
        </p>
        <p className="font-mono text-sm text-primary">admins@bitshiftdevs.com</p>
      </section>
    </div>
  );
}
