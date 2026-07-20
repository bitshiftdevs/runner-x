"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children";

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

export function FeaturesSection() {
  return (
    <section className="py-3xl px-lg bg-surface-container-lowest relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      <div className="w-full max-w-7xl mx-auto">
        <FadeIn className="text-center mb-2xl">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
            Why Runnerx?
          </h2>
          <p className="font-mono text-sm text-on-surface-variant mt-sm">
            Built specifically for campus life
          </p>
        </FadeIn>

        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg"
          staggerDelay={0.08}
        >
          {features.map((f, i) => (
            <StaggerItem key={f.title}>
              <motion.div
                className="group bg-surface border border-outline-variant rounded-xl p-xl space-y-sm hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 40px -12px rgba(26, 122, 109, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: "800ms" }} />

                <motion.span
                  className="material-symbols-outlined text-2xl text-primary inline-block"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  {f.icon}
                </motion.span>
                <h3 className="font-sans text-lg font-semibold text-on-surface">
                  {f.title}
                </h3>
                <p className="font-mono text-sm text-on-surface-variant">
                  {f.desc}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
