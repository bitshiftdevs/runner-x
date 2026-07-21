"use client";

import { motion } from "motion/react";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";
import { FadeIn } from "@/components/animations/fade-in";

export function CtaSection() {
  return (
    <section id="cta" className="py-32 md:py-48 px-6 bg-[#0a0f0e] text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Background Graphic Elements */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="w-full max-w-[1280px] mx-auto text-center relative z-10" style={{ display: "block", width: "100%" }}>
        <FadeIn className="w-full block">
          <h2 className="font-sans text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-none text-white w-full" style={{ display: "block", width: "100%" }}>
            Stop waiting. <br/>
            <span className="text-primary italic">Start running.</span>
          </h2>
        </FadeIn>
        
        <FadeIn delay={0.2} className="w-full mt-12 mb-16 block">
          <p className="font-sans text-xl md:text-2xl text-white/70 mx-auto leading-relaxed" style={{ maxWidth: "600px" }}>
            The hyper-local campus dispatch network is live. Download the app and join the hustle today.
          </p>
        </FadeIn>
        
        <FadeIn delay={0.4} className="w-full flex justify-center">
          <div className="flex justify-center md:scale-125 transition-transform">
            <AppStoreButtons />
          </div>
        </FadeIn>
      </div>
      
    </section>
  );
}
