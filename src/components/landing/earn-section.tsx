"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/fade-in";
import { CountUp } from "@/components/animations/count-up";

export function EarnSection() {
  return (
    <section className="py-3xl px-lg bg-surface-container-lowest relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full bg-success/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="w-full max-w-5xl mx-auto text-center space-y-lg relative">
        <FadeIn>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
            Earn Money Between Classes
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="font-mono text-sm text-on-surface-variant max-w-[42rem] mx-auto">
            Become a Runner and turn your free time into income. Accept quests
            that fit your schedule, get paid instantly via Mobile Money.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div
            className="inline-flex items-center gap-md bg-surface border border-outline-variant rounded-xl px-xl py-md"
            whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(5, 150, 105, 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="material-symbols-outlined text-2xl text-success"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatDelay: 2 }}
            >
              account_balance_wallet
            </motion.span>
            <div className="text-left">
              <p className="font-mono text-xs text-on-surface-variant">
                Average runner earns
              </p>
              <p className="font-sans text-2xl font-bold text-success">
                ₵<CountUp end={50} duration={1.5} />–<CountUp end={150} duration={2} /> / day
              </p>
            </div>
          </motion.div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={0.45}>
          <div className="flex flex-wrap items-center justify-center gap-xl pt-lg">
            <div className="text-center">
              <p className="font-sans text-2xl font-bold text-on-surface">
                <CountUp end={500} suffix="+" duration={2} />
              </p>
              <p className="font-mono text-xs text-on-surface-variant">Active Runners</p>
            </div>
            <div className="w-px h-8 bg-outline-variant" />
            <div className="text-center">
              <p className="font-sans text-2xl font-bold text-on-surface">
                <CountUp end={3} suffix="k+" duration={1.8} />
              </p>
              <p className="font-mono text-xs text-on-surface-variant">Quests Completed</p>
            </div>
            <div className="w-px h-8 bg-outline-variant" />
            <div className="text-center">
              <p className="font-sans text-2xl font-bold text-on-surface">
                <CountUp end={4} suffix=" campuses" duration={1.5} />
              </p>
              <p className="font-mono text-xs text-on-surface-variant">& Growing</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
