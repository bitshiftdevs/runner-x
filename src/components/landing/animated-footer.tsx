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
    <footer className="bg-surface-container-lowest text-on-surface relative overflow-hidden pt-24 pb-12">
      
      {/* Top subtle border to blend slightly with CTA if needed */}
      <div className="absolute top-0 inset-x-0 h-px bg-outline-variant/30" />

      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <FadeIn direction="up" delay={0}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                {/* Runnerx Logo & Name */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/runner-x.png"
                    alt="Runnerx"
                    width={40}
                    height={40}
                    className="rounded-lg bg-surface p-1"
                  />
                  <p className="font-sans text-2xl font-black tracking-tight">
                    Runnerx
                  </p>
                </div>

                {/* Vertical Divider (desktop only) */}
                <div className="w-px h-8 bg-outline-variant hidden sm:block" />

                {/* Bitshift Logo & Mascot */}
                <div className="flex items-center gap-3">
                  <Image 
                    src="/bit-mascot.png" 
                    alt="Bit Mascot" 
                    width={32} 
                    height={32} 
                    className="object-contain" 
                  />
                  <Image 
                    src="/bitshift_logo.png" 
                    alt="Bitshift" 
                    width={72} 
                    height={18} 
                    className="object-contain" 
                  />
                </div>
              </div>
              
              <p className="font-sans text-on-surface-variant leading-relaxed mb-6" style={{ maxWidth: '384px', whiteSpace: 'normal' }}>
                The hyper-local dispatch marketplace built for students, by alumni. A product of Bitshift.
              </p>

              {/* Removed "Live on Campus" */}
            </FadeIn>
          </div>

          {/* Nav Links */}
          <div>
            <FadeIn direction="up" delay={0.1}>
              <p className="font-mono text-sm text-outline uppercase tracking-widest mb-6 font-bold">
                Navigation
              </p>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-on-surface-variant hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Legal Links */}
          <div>
            <FadeIn direction="up" delay={0.2}>
              <p className="font-mono text-sm text-outline uppercase tracking-widest mb-6 font-bold">
                Legal
              </p>
              <ul className="space-y-4">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-on-surface-variant hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

        </div>

        {/* The Massive Watermark & Copyright */}
        <FadeIn direction="up" delay={0.3} className="relative mt-12 border-t border-outline-variant/30 pt-12 flex flex-col items-center">
          
          <div className="w-full overflow-hidden flex justify-center mb-12 opacity-5 select-none pointer-events-none">
            <h1 className="font-sans font-black text-[12vw] leading-none tracking-tighter whitespace-nowrap">
              RUNNERX
            </h1>
          </div>
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              © {new Date().getFullYear()} Bitshift. All rights reserved.
            </p>
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              Kumasi, Ghana 🇬🇭
            </p>
          </div>

        </FadeIn>

      </div>
    </footer>
  );
}
