"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";
import { AnimatedGradient } from "@/components/animations/animated-gradient";
import { FloatingParticles } from "@/components/animations/floating-particles";
import { TextReveal } from "@/components/animations/text-reveal";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-lg overflow-hidden">
      <AnimatedGradient />
      <FloatingParticles count={15} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,122,109,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(26,122,109,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative text-center w-full max-w-4xl mx-auto space-y-lg">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="inline-block"
        >
          <div className="inline-flex items-center gap-sm font-mono text-xs bg-primary/10 text-primary border border-primary/30 px-md py-xs rounded-full backdrop-blur-sm">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              🇬🇭
            </motion.span>
            <span>Now live on Ghana campuses</span>
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-success"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>

        {/* Main heading with text reveal */}
        <motion.h1
          className="font-sans text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-on-surface leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          Campus Hustle,
          <br />
          <motion.span
            className="text-primary inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            Delivered Fast
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-mono text-base md:text-lg text-on-surface-variant max-w-[42rem] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          The student-only marketplace connecting requesters with runners for
          hyper-local campus errands.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="pt-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <AppStoreButtons />
        </motion.div>

        <motion.div
          className="pt-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <Link
            href="/about"
            className="group inline-flex items-center justify-center gap-sm border border-outline-variant text-on-surface font-mono text-sm px-xl py-md rounded-xl hover:border-primary hover:text-primary hover:glow-primary transition-all duration-300"
          >
            <span>Learn More</span>
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-outline-variant rounded-full flex items-start justify-center p-1.5"
            animate={{ borderColor: ["var(--color-outline-variant)", "var(--color-primary)", "var(--color-outline-variant)"] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
