"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/data-deletion", label: "Data Deletion" },
];

export function AnimatedFooter() {
  return (
    <footer className="border-t border-border bg-surface-container-lowest relative overflow-hidden">
      {/* Subtle glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="w-full max-w-7xl mx-auto px-lg py-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          <FadeIn direction="up" delay={0}>
            <div>
              <div className="flex items-center gap-sm">
                <Image
                  src="/runner-x.png"
                  alt="Runnerx"
                  width={28}
                  height={28}
                  className="rounded-md"
                />
                <p className="font-sans text-lg font-bold text-primary tracking-tight">
                  Runnerx
                </p>
              </div>
              <p className="text-xs text-on-surface-variant mt-sm">
                Campus Hustle, Delivered Fast.
              </p>
              <p className="text-xs text-on-surface-variant mt-xs">
                Built for Ghana students 🇬🇭
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-sm">
                Pages
              </p>
              <div className="flex flex-col gap-xs">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-on-surface hover:text-primary hover:translate-x-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-sm">
                Legal
              </p>
              <div className="flex flex-col gap-xs">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-on-surface hover:text-primary hover:translate-x-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <motion.div
          className="mt-xl pt-lg border-t border-border flex flex-col sm:flex-row justify-between items-center gap-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} Runnerx. All rights reserved.
          </p>
          <p className="text-xs text-on-surface-variant">Kumasi, Ghana</p>
        </motion.div>
      </div>
    </footer>
  );
}
