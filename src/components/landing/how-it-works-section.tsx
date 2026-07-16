"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/fade-in";

const steps = [
  {
    num: "01",
    title: "Post a Quest",
    desc: "Describe your errand, set pickup & delivery locations",
    icon: "edit_note",
  },
  {
    num: "02",
    title: "Runner Accepts",
    desc: "A nearby runner picks up your quest from the board",
    icon: "directions_run",
  },
  {
    num: "03",
    title: "Track & Receive",
    desc: "Track live progress and confirm delivery with photo proof",
    icon: "verified",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-3xl px-lg relative">
      <div className="w-full max-w-6xl mx-auto">
        <FadeIn className="text-center mb-2xl">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-on-surface">
            How It Works
          </h2>
          <p className="font-mono text-sm text-on-surface-variant mt-sm">
            Three steps to getting things done
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[3.5rem] left-[16%] right-[16%] h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>

          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={0.2 + i * 0.2} className="text-center space-y-sm relative">
              {/* Animated step number */}
              <motion.div
                className="w-16 h-16 mx-auto rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center relative z-10 backdrop-blur-sm"
                whileInView={{
                  borderColor: ["rgba(26,122,109,0.3)", "rgba(26,122,109,0.8)", "rgba(26,122,109,0.3)"],
                }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 + i * 0.3, repeat: 1 }}
              >
                <motion.span
                  className="material-symbols-outlined text-2xl text-primary"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.2, type: "spring", stiffness: 200 }}
                >
                  {s.icon}
                </motion.span>
              </motion.div>

              {/* Step number badge */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-20"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.2, type: "spring" }}
              >
                <span className="font-mono text-[10px] font-bold text-on-primary">
                  {i + 1}
                </span>
              </motion.div>

              <h3 className="font-sans text-xl font-semibold text-on-surface pt-sm">
                {s.title}
              </h3>
              <p className="font-mono text-sm text-on-surface-variant">
                {s.desc}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
