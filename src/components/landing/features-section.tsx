"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/fade-in";

const features = [
  {
    id: "skip-the-sun",
    title: "Skip the Sun",
    desc: "Don't sweat the 20-minute trek across campus. Let a runner handle the heat while you chill in the library.",
    image: "/feature-sun.jpg",
    flipped: false,
    icon: "wb_sunny",
  },
  {
    id: "protect-your-time",
    title: "Protect Your Time",
    desc: "Got a deadline? Pay a small fee to stay focused on your assignments while we sort your errands.",
    image: "/feature-time.jpg",
    flipped: true,
    icon: "schedule",
  },
  {
    id: "rate-runner",
    title: "Rate & Reward",
    desc: "Mutual ratings keep the community accountable. Tip your favorite runners and build trust on campus.",
    image: "/rate-runner.jpg",
    flipped: false,
    icon: "star",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-3xl px-lg bg-background relative overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto space-y-32">
        
        <FadeIn className="text-center mb-2xl">
          <h2 className="font-sans text-3xl md:text-5xl font-black text-on-surface tracking-tight">
            Built for the campus grind.
          </h2>
          <p className="font-mono text-lg text-on-surface-variant mt-sm">
            Everything you need to survive the semester.
          </p>
        </FadeIn>

        <div className="space-y-32">
          {features.map((feature, i) => (
            <div key={feature.id} className="grid grid-cols-1 lg:grid-cols-2 gap-xl lg:gap-32 items-center">
              
              {/* Image Column (UI Mockup Container) */}
              <motion.div 
                className={`relative w-full aspect-square md:aspect-video lg:aspect-square bg-surface-container-high rounded-[3rem] overflow-hidden shadow-2xl flex items-end justify-center pt-16 px-8 ${feature.flipped ? "lg:order-last" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              >
                {/* Subtle background grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(26,122,109,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(26,122,109,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Pseudo-Device Frame for the UI Screenshot */}
                <div className="relative w-full max-w-[300px] aspect-[9/19] bg-background rounded-t-[2.5rem] overflow-hidden shadow-2xl shadow-black/40 z-10 border-[8px] border-b-0 border-surface-container-lowest translate-y-[2px]">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                
                {/* Optional overlay gradient for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none" />
              </motion.div>

              {/* Text Column */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: feature.flipped ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    {feature.icon}
                  </span>
                </div>
                
                <h3 className="font-sans text-4xl lg:text-5xl font-black text-on-surface tracking-tight leading-tight">
                  {feature.title}
                </h3>
                
                <p className="font-sans text-xl text-on-surface-variant leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
