"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/fade-in";

export function EarnSection() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-lowest text-on-surface relative overflow-hidden flex items-center min-h-[90vh]">
      
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Massive Typography */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-left">
          <FadeIn direction="left" duration={0.8} className="w-full">
            <h2 className="font-sans text-6xl md:text-8xl lg:text-[100px] font-black uppercase leading-[0.85] tracking-tighter mb-8 text-on-surface">
              Got a <br/>
              <span className="text-primary italic">2-hour</span> <br/>
              gap?
            </h2>
            <div className="w-24 h-2 bg-primary mb-8" />
            <h3 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-on-surface">
              Make it pay.
            </h3>
            <p className="font-sans text-lg md:text-xl text-on-surface-variant mb-12 leading-relaxed" style={{ maxWidth: "512px" }}>
              Don't just sit in the library. Open the app, accept a quest, and make money while walking to your next class. Work when you want, earn what you want.
            </p>
            <button 
              onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-[#0a0f0e] px-10 py-5 rounded-full font-bold text-xl uppercase tracking-wider hover:bg-on-surface hover:text-surface transition-colors duration-300 w-full md:w-max text-center shadow-[0_0_40px_rgba(60,232,190,0.3)] hover:shadow-[0_0_60px_rgba(0,0,0,0.2)]"
            >
              Become a Runner
            </button>
          </FadeIn>
        </div>

        {/* Right Side: The Collage */}
        <div className="w-full lg:w-1/2 relative h-[500px] md:h-[700px] flex items-center justify-center mt-12 lg:mt-0">
          
          <FadeIn direction="right" duration={0.8} delay={0.2} className="relative w-full h-full max-w-[450px] mx-auto">
            
            {/* The Main Avatar Graphic */}
            <motion.div 
              className="absolute inset-0 rounded-[3rem] overflow-hidden z-10 shadow-2xl shadow-black/10 border-4 border-outline-variant/30 bg-surface"
              initial={{ rotate: -5 }}
              whileInView={{ rotate: -2 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent z-10" />
              <img 
                src="/runner-avatar.jpg" 
                alt="Runner" 
                className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>

            {/* The Runner-X Logo Stamp */}
            <motion.div 
              className="absolute -bottom-12 -right-8 md:-right-16 z-20 w-48 h-48 md:w-64 md:h-64 bg-surface rounded-full flex items-center justify-center p-8 border-8 border-primary shadow-2xl shadow-black/10"
              initial={{ scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 12 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
            >
              <img 
                src="/runner-x.png" 
                alt="RunnerX" 
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Floating Earnings Tag */}
            <motion.div
              className="absolute top-12 -left-8 md:-left-16 z-20 bg-surface text-on-surface px-6 py-4 rounded-2xl shadow-2xl font-bold font-sans text-2xl flex items-center gap-3 border-l-8 border-primary shadow-black/10"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <span className="text-4xl text-primary material-symbols-outlined">payments</span>
              +₵150.00 <span className="text-sm text-on-surface-variant/70 font-mono font-normal uppercase mt-1">Today</span>
            </motion.div>

          </FadeIn>
          
        </div>

      </div>
    </section>
  );
}
