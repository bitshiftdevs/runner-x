"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FadeIn } from "@/components/animations/fade-in";

const faqs = [
  {
    question: "How fast does an errand get completed?",
    answer: "Usually within minutes. Because runners are already on campus nearby, requests are picked up and delivered faster."
  },
  {
    question: "How does payment work?",
    answer: "All through the app via Mobile Money."
  },
  {
    question: "What if something goes wrong or my order is cancelled?",
    answer: "You're covered. If a runner cancels, your request goes straight back to the board for another student to take. If there's an issue with your order, report it in the app for a quick fix or refund."
  },
  {
    question: "Is Runnerx safe and trustworthy?",
    answer: "Yes. Every runner is a student verified with their official school ID. You can track your errand in real-time and check ratings before they start."
  },
  {
    question: "What items can I request?",
    answer: "Anything light to medium. Meals, campus paperwork, groceries, and small packages. Heavy loads (like gas cylinders or large furniture) are not allowed."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 px-6 bg-surface">
      <div className="w-full max-w-[768px] mx-auto">
        <FadeIn className="text-center mb-16 block">
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tight" style={{ display: "block", width: "100%" }}>
            Got <span className="text-primary">questions?</span>
          </h2>
          <p className="font-sans text-lg text-on-surface-variant mt-4 w-full" style={{ display: "block", width: "100%", whiteSpace: "normal" }}>
            Everything you need to know about the hustle.
          </p>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <FadeIn key={index} delay={index * 0.1}>
                <div 
                  className={`border-2 rounded-3xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-container hover:border-primary/50'}`}
                >
                  <button
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-sans text-xl md:text-2xl font-bold text-on-surface pr-8">
                      {faq.question}
                    </span>
                    <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                          <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
