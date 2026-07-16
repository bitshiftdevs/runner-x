"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("waitlist_leads").insert({
      email: email.trim().toLowerCase(),
      platform: "ios",
    });

    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } else {
      setStatus("success");
      setEmail("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-xl space-y-lg animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-md right-md text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Close"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {status === "success" ? (
          <div className="text-center space-y-md py-lg">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-success">check_circle</span>
            </div>
            <h3 className="font-sans text-xl font-bold text-on-surface">You&apos;re on the list!</h3>
            <p className="font-mono text-sm text-on-surface-variant">
              We&apos;ll notify you as soon as Runnerx is available on iOS.
            </p>
            <button
              onClick={onClose}
              className="font-mono text-sm text-primary hover:underline"
              type="button"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="text-center space-y-sm">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-primary">phone_iphone</span>
              </div>
              <h3 id="waitlist-title" className="font-sans text-xl font-bold text-on-surface">
                iOS Coming Soon
              </h3>
              <p className="font-mono text-sm text-on-surface-variant">
                Join the waitlist and be the first to know when Runnerx launches on iPhone.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label htmlFor="waitlist-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@university.edu.gh"
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-lg py-md font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {status === "error" && (
                <p className="font-mono text-xs text-error">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-sm bg-primary text-on-primary font-mono text-sm px-xl py-md rounded-xl hover:glow-primary transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Joining...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                    Notify Me
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
