"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const steps = [
  {
    num: "01",
    title: "Post a Quest",
    desc: "Pin your location, set your deadline, and name your price.",
    image: "/order-screen.jpg",
  },
  {
    num: "02",
    title: "Track Your Runner",
    desc: "A verified student accepts your quest. Watch them navigate the campus map in real-time.",
    image: "/map-tracking.jpg",
  },
  {
    num: "03",
    title: "Mission Accomplished",
    desc: "Receive your items and confirm delivery. Your quest is complete and the runner gets paid.",
    image: "/payment-complete.jpg",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-surface-container-lowest relative pb-3xl">
      {/* Header */}
      <div className="w-full max-w-[1280px] mx-auto px-lg pt-3xl pb-xl text-center md:text-left">
        <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tight mb-4">
          From request to delivery in <span className="text-primary">3 Steps.</span>
        </h2>
        <p className="font-mono text-lg text-on-surface-variant mt-md">
          Scroll down to see the magic happen.
        </p>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-lg flex flex-col lg:flex-row items-stretch gap-8 relative">
        
        {/* Left Column: Scrolling Text Steps */}
        <div className="w-full lg:w-[55%] pr-0 lg:pr-12">
          {steps.map((step, i) => (
            <motion.div 
              key={step.num}
              className="flex flex-col justify-center py-24 lg:py-48 w-full"
              onViewportEnter={() => setActiveStep(i)}
              viewport={{ amount: 0.5, margin: "-100px 0px -100px 0px" }}
            >
              <div className={`w-full transition-all duration-500 ${activeStep === i ? "opacity-100 scale-100" : "opacity-30 scale-95"}`} style={{ display: "block", width: "100%" }}>
                <div className="font-mono text-4xl md:text-6xl font-black text-outline-variant mb-4 transition-colors duration-500" style={{ color: activeStep === i ? "var(--color-primary)" : "" }}>
                  {step.num}
                </div>
                <h3 className="font-sans text-3xl md:text-4xl font-bold text-on-surface mb-4 whitespace-nowrap">
                  {step.title}
                </h3>
                <p className="font-sans text-lg text-on-surface-variant leading-relaxed w-full" style={{ display: "block", width: "100%", whiteSpace: "normal" }}>
                  {step.desc}
                </p>
              </div>

              {/* Mobile Only Image */}
              <div className={`lg:hidden mt-12 w-full max-w-[280px] aspect-[9/19] bg-background rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-surface transition-all duration-700 ${activeStep === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <img src={step.image} alt={step.title} className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Sticky Phone (Desktop Only) */}
        <div className="hidden lg:block lg:w-[45%] relative">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center">
             
             {/* Scaled-down Phone Mockup */}
             <div className="relative w-full max-w-[280px] aspect-[9/19] bg-background rounded-[3rem] shadow-2xl shadow-black/40 border-[8px] border-surface-container-high overflow-hidden shrink-0">
                
                {/* Dynamic Image Crossfade */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeStep}
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>

                {/* iPhone Notch Simulator */}
                <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20 pointer-events-none">
                  <div className="w-24 h-full bg-surface-container-high rounded-b-3xl" />
                </div>
                
                {/* iPhone Bottom Bar Simulator */}
                <div className="absolute bottom-2 inset-x-0 h-1 flex justify-center z-20 pointer-events-none">
                  <div className="w-1/3 h-full bg-white/50 rounded-full" />
                </div>
             </div>

          </div>
        </div>

      </div>
    </section>
  );
}
