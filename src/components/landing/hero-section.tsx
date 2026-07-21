"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";
import Link from "next/link";

export function HeroSection() {
  const [requestLocation, setRequestLocation] = useState("");

  const handleRequestClick = () => {
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 px-lg overflow-hidden bg-background">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2xl items-center z-10">
        {/* Left Side: Typography and Action */}
        <div className="space-y-xl max-w-[672px] min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-on-surface leading-[1.05]">
              Beat the sun.
              <br />
              <span className="text-on-surface-variant">Save your legs.</span>
            </h1>
          </motion.div>

          <motion.p
            className="font-sans text-lg md:text-xl text-on-surface-variant leading-relaxed w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Don't melt walking across campus. Runnerx connects you with trusted school mates to handle your errands in minutes, so you can focus on what matters.
          </motion.p>

          <motion.div
            className="pt-sm w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Interactive Intent Box */}
            <div className="flex flex-col sm:flex-row gap-sm p-2 bg-surface border border-outline-variant/50 rounded-2xl shadow-lg shadow-black/5 w-full max-w-[512px] transition-all focus-within:border-primary/50 focus-within:shadow-primary/10 focus-within:ring-2 focus-within:ring-primary/20">
              <div className="flex-1 flex items-center gap-sm px-md py-sm min-w-0">
                <span className="material-symbols-outlined text-outline shrink-0">location_on</span>
                <input 
                  type="text" 
                  value={requestLocation}
                  onChange={(e) => setRequestLocation(e.target.value)}
                  placeholder="Where do you need a runner?" 
                  className="w-full bg-transparent border-none outline-none text-on-surface placeholder:text-outline-variant font-sans text-base min-w-0"
                />
              </div>
              <button 
                onClick={handleRequestClick}
                className="bg-primary text-on-primary font-sans font-medium px-xl py-3 rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap shadow-md shadow-primary/20 shrink-0 cursor-pointer"
              >
                Request Now
              </button>
            </div>
            <p className="font-mono text-xs text-outline mt-md pl-2">
              Be among the first to reclaim your time on campus.
            </p>
          </motion.div>
        </div>

        {/* Right Side: High-Fidelity UI Mockup */}
        <motion.div
          className="relative lg:h-[600px] flex items-center justify-center lg:justify-end hidden md:flex min-w-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
        >
          {/* App UI Background Screenshot Placeholder */}
          <div 
            className="absolute right-0 w-full max-w-[600px] h-[120%] -top-[10%] bg-[url('/app-ui-bg.jpg')] bg-cover bg-center opacity-60 pointer-events-none z-0" 
            style={{ WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 90%)", maskImage: "radial-gradient(circle at center, black 40%, transparent 90%)" }} 
          />

          {/* Main Floating Card */}
          <div className="w-full max-w-[448px] bg-surface/70 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-2xl shadow-primary/10 relative z-10">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-mono text-xs text-outline-variant uppercase tracking-wider font-semibold">Active Quest</p>
                <h3 className="font-sans text-xl font-bold text-on-surface mt-1">Library Print Run</h3>
              </div>
              <span className="bg-primary/10 text-primary font-mono text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                In Progress
              </span>
            </div>

            {/* Tracking Map Mockup */}
            <div className="bg-surface-container-lowest rounded-2xl h-48 mb-6 relative overflow-hidden border border-outline-variant/20 flex flex-col justify-between p-4">
               {/* Decorative map grid */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(26,122,109,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(26,122,109,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
               
               {/* Route Line */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-0.5 bg-dashed border-t-2 border-dashed border-primary/40" />

               {/* Origin Point */}
               <div className="absolute top-[40%] left-[20%] flex flex-col items-center">
                 <div className="w-4 h-4 bg-surface border-2 border-primary rounded-full relative z-10 shadow-sm" />
                 <span className="font-mono text-[10px] text-on-surface-variant mt-1 bg-surface/80 px-1 rounded whitespace-nowrap">College Library</span>
               </div>

               {/* Runner Point (Moving) */}
               <motion.div 
                 className="absolute top-[35%] left-[50%] flex flex-col items-center z-20"
                 animate={{ x: [-20, 20, -20] }}
                 transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
               >
                 <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                   <span className="material-symbols-outlined text-on-primary text-sm">directions_run</span>
                 </div>
               </motion.div>

               {/* Destination Point */}
               <div className="absolute top-[50%] right-[20%] flex flex-col items-center">
                 <div className="w-6 h-6 bg-surface border-2 border-on-surface rounded-full flex items-center justify-center relative z-10 shadow-sm">
                   <div className="w-2 h-2 bg-on-surface rounded-full" />
                 </div>
                 <span className="font-mono text-[10px] text-on-surface-variant mt-1 bg-surface/80 px-1 rounded whitespace-nowrap">Printing Press</span>
               </div>
            </div>

            {/* Runner Profile */}
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl overflow-hidden">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0 overflow-hidden relative">
                 {/* Provide this image in public/runner-avatar.jpg */}
                 <img src="/runner-avatar.jpg" alt="Kwame A." className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-sans font-semibold text-on-surface truncate">Kwame A.</h4>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                  <span className="font-mono text-xs font-medium">4.9 (120)</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-surface border border-outline-variant flex items-center justify-center hover:bg-surface-hover transition-colors shrink-0">
                 <span className="material-symbols-outlined text-on-surface text-lg">chat</span>
              </button>
            </div>
          </div>

          {/* Decorative floating elements behind card */}
          <motion.div 
            className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
