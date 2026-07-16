"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children";
import { MagneticHover } from "@/components/animations/magnetic-hover";

const categories = [
  { icon: "restaurant", label: "Food & Drinks" },
  { icon: "menu_book", label: "Academic Materials" },
  { icon: "local_shipping", label: "Pickup & Delivery" },
  { icon: "handyman", label: "General Errands" },
];

export function CategoriesSection() {
  return (
    <section className="py-3xl px-lg">
      <div className="w-full max-w-6xl mx-auto text-center">
        <FadeIn>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-lg">
            What can you get done?
          </p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-md" staggerDelay={0.12}>
          {categories.map((cat) => (
            <StaggerItem key={cat.label}>
              <MagneticHover intensity={0.15}>
                <div className="group bg-surface border border-outline-variant rounded-xl p-lg flex flex-col items-center gap-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default">
                  <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                  <span className="font-mono text-sm text-on-surface">
                    {cat.label}
                  </span>
                </div>
              </MagneticHover>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
