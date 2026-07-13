import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Runner_X",
  description: "Learn about Runner_X, the student-only dispatch marketplace for university campuses in Ghana.",
};

const values = [
  { icon: "school", title: "Student-First", desc: "Built by students, for students. We understand campus life." },
  { icon: "handshake", title: "Trust & Safety", desc: "Every user is verified with a student ID before they can participate." },
  { icon: "speed", title: "Speed", desc: "Hyper-local means your errand gets done in minutes, not hours." },
  { icon: "diversity_3", title: "Community", desc: "We're building a campus economy that benefits everyone." },
];

export default function AboutPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-lg py-3xl space-y-3xl">
      <section className="text-center space-y-md">
        <h1 className="font-sans text-4xl md:text-5xl font-black text-on-surface">About Runner_X</h1>
        <p className="font-mono text-sm text-on-surface-variant max-w-[42rem] mx-auto">
          Runner_X is a student-only, hyper-local dispatch marketplace for university campuses across Ghana.
        </p>
      </section>

      <section className="space-y-lg">
        <h2 className="font-sans text-2xl font-bold text-on-surface">Our Mission</h2>
        <p className="font-mono text-sm text-on-surface-variant leading-relaxed">
          We connect <strong className="text-on-surface">Requesters</strong> (students needing errands done) with <strong className="text-on-surface">Runners</strong> (students looking to earn money between classes). Think of it as the on-campus Uber for errands — food pickups, printing, document runs, and more.
        </p>
        <p className="font-mono text-sm text-on-surface-variant leading-relaxed">
          Our dispatch-first model means item costs are handled directly between parties via cash or MoMo. The platform only manages the transparent service/delivery fee — keeping things simple, fast, and low-risk.
        </p>
      </section>

      <section className="space-y-lg">
        <h2 className="font-sans text-2xl font-bold text-on-surface">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {values.map((v) => (
            <div key={v.title} className="bg-surface border border-outline-variant rounded-xl p-lg space-y-sm">
              <span className="material-symbols-outlined text-2xl text-primary">{v.icon}</span>
              <h3 className="font-sans text-lg font-semibold text-on-surface">{v.title}</h3>
              <p className="font-mono text-xs text-on-surface-variant">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-lg">
        <h2 className="font-sans text-2xl font-bold text-on-surface">How It Works</h2>
        <div className="bg-surface border border-outline-variant rounded-xl p-lg space-y-md">
          <div className="flex items-start gap-md">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-xs font-bold text-primary">1</span>
            </div>
            <p className="font-mono text-sm text-on-surface-variant"><strong className="text-on-surface">Post a Quest:</strong> Describe what you need, set locations, and choose urgency.</p>
          </div>
          <div className="flex items-start gap-md">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-xs font-bold text-primary">2</span>
            </div>
            <p className="font-mono text-sm text-on-surface-variant"><strong className="text-on-surface">Pay the Service Fee:</strong> A transparent fee is calculated based on distance and urgency.</p>
          </div>
          <div className="flex items-start gap-md">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-xs font-bold text-primary">3</span>
            </div>
            <p className="font-mono text-sm text-on-surface-variant"><strong className="text-on-surface">Runner Delivers:</strong> Track your runner live and confirm delivery with photo proof.</p>
          </div>
        </div>
      </section>

      <section className="text-center space-y-md bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
        <h2 className="font-sans text-2xl font-bold text-on-surface">Contact Us</h2>
        <p className="font-mono text-sm text-on-surface-variant">Have questions? Reach out to our team.</p>
        <p className="font-mono text-sm text-primary">support@runnerx.app</p>
      </section>
    </div>
  );
}
