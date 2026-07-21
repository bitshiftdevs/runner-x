"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { motion } from "motion/react";

const quests = [
  { 
    id: "food",
    title: "Food Run", 
    location: "Bush Canteen ➔ Your Hostel", 
    bounty: "GHS 15",
    time: "10 mins",
    icon: "restaurant" 
  },
  { 
    id: "print",
    title: "Print Job", 
    location: "Balme Library ➔ JQB", 
    bounty: "GHS 10",
    time: "15 mins",
    icon: "print" 
  },
  { 
    id: "delivery",
    title: "Item Pickup", 
    location: "Pentagon ➔ Evandy", 
    bounty: "GHS 20",
    time: "20 mins",
    icon: "local_shipping" 
  },
  { 
    id: "custom",
    title: "Charger Rescue", 
    location: "Night Market ➔ Bani", 
    bounty: "GHS 25",
    time: "Urgent",
    icon: "bolt" 
  },
  { 
    id: "grocery",
    title: "Grocery Run", 
    location: "Campus Mart ➔ TF Hostel", 
    bounty: "GHS 30",
    time: "30 mins",
    icon: "shopping_basket" 
  },
];

export function CategoriesSection() {
  return (
    <section className="py-3xl bg-surface-container-lowest overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto px-lg">
        <FadeIn className="text-center md:text-left mb-xl flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-sans text-3xl md:text-4xl font-black text-on-surface mb-xs tracking-tight">
              Live Quest Board
            </h2>
            <p className="font-mono text-sm text-on-surface-variant">
              Swipe to see what's paying right now
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-primary font-mono text-sm font-bold">
            <span>Scroll</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </div>
        </FadeIn>
      </div>
      
      {/* Horizontal Carousel */}
      <div className="w-full relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-lg md:px-[calc((100vw-1280px)/2+2rem)] pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {quests.map((quest, i) => (
            <motion.div
              key={quest.id}
              className="shrink-0 w-[300px] sm:w-[350px] snap-center sm:snap-start group cursor-pointer"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Ticket Top */}
              <div className="bg-surface border border-outline-variant/30 rounded-t-3xl p-6 border-b-0 relative overflow-hidden">
                {/* Subtle Gradient Wash on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-on-surface group-hover:text-on-primary transition-colors duration-300">
                      {quest.icon}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-error/10 text-error px-2 py-1 rounded-md">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span className="font-mono text-xs font-bold">{quest.time}</span>
                  </div>
                </div>

                <div className="mt-6 relative z-10">
                  <h3 className="font-sans text-2xl font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                    {quest.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">route</span>
                    <p className="font-mono text-xs truncate">
                      {quest.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ticket Divider (Dashed line with side cutouts) */}
              <div className="relative h-0 border-t-2 border-dashed border-outline-variant/30 bg-surface">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-surface-container-lowest rounded-full border border-outline-variant/30 z-10" />
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-surface-container-lowest rounded-full border border-outline-variant/30 z-10" />
              </div>

              {/* Ticket Bottom (Bounty) */}
              <div className="bg-surface border border-outline-variant/30 rounded-b-3xl p-6 border-t-0 flex items-center justify-between group-hover:bg-primary/5 transition-colors duration-300">
                <span className="font-mono text-sm text-on-surface-variant uppercase tracking-wider">
                  Bounty
                </span>
                <span className="font-sans text-2xl font-black text-primary">
                  {quest.bounty}
                </span>
              </div>

            </motion.div>
          ))}
        </div>
        
        {/* Right fade out gradient for desktop */}
        <div className="hidden md:block absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-surface-container-lowest to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
