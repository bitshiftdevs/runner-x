import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";

export const metadata: Metadata = {
  title: "Runner_X — Campus Hustle, Delivered Fast",
  description:
    "Student-only hyper-local dispatch marketplace for university campuses in Ghana. Get errands done or earn money between classes.",
};

const features = [
  {
    icon: "bolt",
    title: "Instant Dispatch",
    desc: "Post a job and get matched with a runner in minutes",
  },
  {
    icon: "payments",
    title: "Mobile Money",
    desc: "Pay seamlessly via MoMo — no cash hassle",
  },
  {
    icon: "location_on",
    title: "Live Tracking",
    desc: "Watch your runner in real-time on campus",
  },
  {
    icon: "verified_user",
    title: "Student Verified",
    desc: "Only verified Ghana university students can join",
  },
  {
    icon: "star",
    title: "Rated & Trusted",
    desc: "Mutual ratings keep the community accountable",
  },
  {
    icon: "speed",
    title: "Urgency Options",
    desc: "Need it in 10 min? Set urgency for priority matching",
  },
];

const steps = [
  {
    num: "01",
    title: "Post a Quest",
    desc: "Describe your errand, set pickup & delivery locations",
  },
  {
    num: "02",
    title: "Runner Accepts",
    desc: "A nearby runner picks up your quest from the board",
  },
  {
    num: "03",
    title: "Track & Receive",
    desc: "Track live progress and confirm delivery with photo proof",
  },
];

const categories = [
  { icon: "restaurant", label: "Food & Drinks" },
  { icon: "menu_book", label: "Academic Materials" },
  { icon: "local_shipping", label: "Pickup & Delivery" },
  { icon: "handyman", label: "General Errands" },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.08,transparent_70%)]" />
        <div className="relative text-center w-full max-w-4xl mx-auto space-y-lg">
          <div className="inline-block font-mono text-xs bg-primary/10 text-primary border border-primary/30 px-md py-xs rounded-full">
            🇬🇭 Now live on Ghana campuses
          </div>
          <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-on-surface leading-[1.1]">
            Campus Hustle,
            <br />
            <span className="text-primary">Delivered Fast</span>
          </h1>
          <p className="font-mono text-base md:text-lg text-on-surface-variant max-w-[42rem] mx-auto">
            The student-only marketplace connecting requesters with runners for
            hyper-local campus errands.
          </p>
          <div className="pt-md">
            <AppStoreButtons />
          </div>
          <div className="pt-sm">
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-sm border border-outline-variant text-on-surface font-mono text-sm px-xl py-md rounded-xl hover:border-primary hover:text-primary transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-3xl px-lg">
        <div className="w-full max-w-6xl mx-auto text-center">
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-lg">
            What can you get done?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col items-center gap-sm hover:border-primary/50 transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-primary">
                  {cat.icon}
                </span>
                <span className="font-mono text-sm text-on-surface">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-3xl px-lg bg-surface-container-lowest">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-2xl">
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
              Why Runner_X?
            </h2>
            <p className="font-mono text-sm text-on-surface-variant mt-sm">
              Built specifically for campus life
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-surface border border-outline-variant rounded-xl p-xl space-y-sm hover:border-primary/50 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl text-primary">
                  {f.icon}
                </span>
                <h3 className="font-sans text-lg font-semibold text-on-surface">
                  {f.title}
                </h3>
                <p className="font-mono text-sm text-on-surface-variant">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-3xl px-lg">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-2xl">
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
              How It Works
            </h2>
            <p className="font-mono text-sm text-on-surface-variant mt-sm">
              Three steps to getting things done
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {steps.map((s) => (
              <div key={s.num} className="text-center space-y-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="font-mono text-xl font-bold text-primary">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-sans text-xl font-semibold text-on-surface">
                  {s.title}
                </h3>
                <p className="font-mono text-sm text-on-surface-variant">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earn section */}
      <section className="py-3xl px-lg bg-surface-container-lowest">
        <div className="w-full max-w-5xl mx-auto text-center space-y-lg">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
            Earn Money Between Classes
          </h2>
          <p className="font-mono text-sm text-on-surface-variant max-w-[42rem] mx-auto">
            Become a Runner and turn your free time into income. Accept quests
            that fit your schedule, get paid instantly via Mobile Money.
          </p>
          <div className="inline-flex items-center gap-md bg-surface border border-outline-variant rounded-xl px-xl py-md">
            <span className="material-symbols-outlined text-2xl text-success">
              account_balance_wallet
            </span>
            <div className="text-left">
              <p className="font-mono text-xs text-on-surface-variant">
                Average runner earns
              </p>
              <p className="font-sans text-2xl font-bold text-success">
                ₵50–150 / day
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-3xl px-lg">
        <div className="w-full max-w-4xl mx-auto text-center space-y-lg">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
            Ready to get started?
          </h2>
          <p className="font-mono text-sm text-on-surface-variant">
            Download the app and join the campus hustle
          </p>
          <AppStoreButtons />
        </div>
      </section>
    </div>
  );
}
