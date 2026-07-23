"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const facts = [
  "A product of Bitshift.",
  "Earn money between classes by completing quests.",
  "Instantly cash out your earnings via MoMo.",
  "Did you know? Airbnb funded their startup by selling custom cereal boxes.",
  "Did you know? Slack started as an internal communication tool for a gaming company.",
  "Runnerx connects you directly to your campus economy.",
];

export function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [factIndex, setFactIndex] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    // Check initial network status
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        if (connection.effectiveType === "2g" || connection.effectiveType === "slow-2g") {
          setIsSlowNetwork(true);
        }
        
        connection.addEventListener("change", () => {
          if (connection.effectiveType === "2g" || connection.effectiveType === "slow-2g") {
            setIsSlowNetwork(true);
          } else {
            setIsSlowNetwork(false);
          }
        });
      }

      window.addEventListener("online", () => setIsOffline(false));
      window.addEventListener("offline", () => setIsOffline(true));
    }

    // Rotate facts every 3 seconds
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 3000);

    // Minimum splash screen duration is 2.5 seconds (so they can see the cool animation)
    const timer = setTimeout(() => {
      // Only dismiss if we are online and not on a painfully slow network
      // (If slow, we give it an extra 2 seconds before dismissing to mask hydration)
      setLoading(false);
    }, 3000);

    return () => {
      clearInterval(factInterval);
      clearTimeout(timer);
    };
  }, []);

  // If offline, force loading to stay true
  const showSplash = loading || isOffline || isSlowNetwork;

  // We actually want to eventually dismiss it even if slow, but offline stays forever until online.
  // Let's refine: slow network keeps it for 6 seconds max. Offline keeps it infinitely.
  useEffect(() => {
    if (isSlowNetwork && !isOffline) {
      const slowTimer = setTimeout(() => setLoading(false), 6000);
      return () => clearTimeout(slowTimer);
    }
  }, [isSlowNetwork, isOffline]);

  return (
    <AnimatePresence>
      {(loading || isOffline) && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/90 backdrop-blur-2xl"
        >
          {/* Animation Container */}
          <div className="relative w-64 h-32 flex items-center justify-center mb-12">
            
            {/* Bitshift Mascot (Waiting for delivery) */}
            <motion.div
              className="absolute right-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/bit-mascot.png" alt="Bit Mascot" width={64} height={64} className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            </motion.div>

            {/* Runnerx delivering to Bitshift */}
            <motion.div
              className="absolute left-0 z-10"
              animate={{ 
                x: [0, 100, 120, 100, -50, 0],
                y: [0, -20, 0, -20, 0, 0],
                rotate: [0, 10, 0, -10, 0, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative">
                <Image src="/runner-x.png" alt="Runnerx" width={48} height={48} className="rounded-xl bg-white p-1 shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
                {/* The "Package" being dropped off */}
                <motion.div
                  className="absolute -bottom-2 -right-2 text-xl"
                  animate={{ opacity: [0, 1, 0, 0, 0], scale: [0.5, 1, 0.5, 0, 0], y: [0, 20, 30, 0, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  📦
                </motion.div>
              </div>
            </motion.div>

          </div>

          {/* Facts Carousel */}
          <div className="h-16 flex items-center justify-center px-6 text-center max-w-[448px] w-full">
            <AnimatePresence mode="wait">
              <motion.p
                key={factIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-sm text-on-surface-variant"
              >
                {facts[factIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Network Status Indicators */}
          <div className="absolute bottom-24 flex flex-col items-center gap-2">
            {isOffline ? (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
                <span className="material-symbols-outlined text-sm">wifi_off</span>
                <span className="font-mono text-xs uppercase tracking-widest font-bold">You are offline</span>
              </div>
            ) : isSlowNetwork ? (
              <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-4 py-2 rounded-full border border-amber-400/20">
                <span className="material-symbols-outlined text-sm">network_wifi_1_bar</span>
                <span className="font-mono text-xs uppercase tracking-widest font-bold">Slow Connection</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-on-surface-variant/50">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest">Connecting to Campus</span>
              </div>
            )}
          </div>

          {/* Made by Bitshift Footer */}
          <div className="absolute bottom-6 flex items-center gap-2 opacity-50">
            <span className="font-mono text-[10px] text-on-surface uppercase tracking-widest">Made by</span>
            <Image src="/bitshift_logo.png" alt="Bitshift" width={56} height={14} className="object-contain" />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
