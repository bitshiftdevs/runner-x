"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function AnimatedNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-border shadow-sm"
          : "bg-transparent border-transparent"
      )}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="w-full max-w-[1280px] mx-auto px-lg flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-sm group">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/runner-x.png"
              alt="Runnerx"
              width={36}
              height={36}
              className="rounded-lg"
            />
          </motion.div>
          <motion.span
            className="font-sans text-xl font-bold text-primary tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            Runnerx
          </motion.span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-lg">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                href={link.href}
                className="relative text-sm text-on-surface-variant hover:text-primary transition-colors hidden sm:block group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            </motion.div>
          ))}

          {/* Mobile links */}
          {navLinks.map((link) => (
            <Link
              key={`mobile-${link.href}`}
              href={link.href}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors sm:hidden"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
