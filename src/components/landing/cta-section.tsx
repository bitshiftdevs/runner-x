"use client";

import { motion } from "motion/react";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";
import { FadeIn } from "@/components/animations/fade-in";

export function CtaSection() {
  return (
    <section className="py-3xl px-lg relative overflow-hidden">
      {/* Animated border glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[600px] h-[600px] rounded-full border border-primary/10"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full border border-primary/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto text-center space-y-lg relative">
        <FadeIn>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
            Ready to get started?
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="font-mono text-sm text-on-surface-variant">
            Download the app and join the campus hustle
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <AppStoreButtons />
        </FadeIn>
      </div>
    </section>
  );
}
