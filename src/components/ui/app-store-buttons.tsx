"use client";

import { useState } from "react";
import { WaitlistModal } from "./waitlist-modal";

const PLAYSTORE_URL =
  process.env.NEXT_PUBLIC_PLAYSTORE_URL ||
  "https://play.google.com/store/apps/details?id=com.prodigy.runner_x";

export function AppStoreButtons() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-md justify-center items-center">
        {/* Google Play Button */}
        <a
          href={PLAYSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-sm bg-primary text-on-primary font-mono text-sm px-xl py-md rounded-xl hover:opacity-90 transition-all active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
          </svg>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wider opacity-80">Get it on</span>
            <span className="text-sm font-semibold">Google Play</span>
          </span>
        </a>

        {/* iOS Coming Soon */}
        <button
          onClick={() => setWaitlistOpen(true)}
          className="inline-flex items-center gap-sm border-2 border-outline text-on-surface font-mono text-sm px-xl py-md rounded-xl hover:border-primary hover:text-primary transition-all active:scale-95"
          type="button"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Coming soon on</span>
            <span className="text-sm font-semibold">App Store</span>
          </span>
        </button>
      </div>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </>
  );
}
