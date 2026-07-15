"use client";

import { useState } from "react";
import Image from "next/image";
import { WaitlistModal } from "./waitlist-modal";

const PLAYSTORE_URL =
  process.env.NEXT_PUBLIC_PLAYSTORE_URL ||
  "https://play.google.com/store/apps/details?id=com.prodigy.runner_x";

export function AppStoreButtons() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-md justify-center items-center">
        {/* Google Play Badge */}
        <a
          href={PLAYSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity active:scale-95"
        >
          <Image
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            width={200}
            height={60}
            className="h-[60px] w-auto"
            unoptimized
          />
        </a>

        {/* iOS Coming Soon */}
        <button
          onClick={() => setWaitlistOpen(true)}
          className="inline-flex items-center gap-sm bg-surface border border-outline-variant text-on-surface font-mono text-sm px-lg py-sm rounded-xl hover:border-primary hover:text-primary transition-all active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Coming Soon on</span>
            <span className="text-sm font-semibold">App Store</span>
          </span>
        </button>
      </div>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
}
