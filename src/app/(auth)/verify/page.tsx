"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/stores";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center text-on-surface-variant">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const setUser = useAuthStore((s) => s.setUser);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  function handleChange(idx: number, val: string) {
    if (val.length > 1) val = val.slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid code");
        return;
      }
      setUser(data.user);
      if (data.isNewUser) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendTimer(60);
    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
  }

  return (
    <div className="space-y-xl">
      <div className="text-center space-y-sm">
        <h1 className="font-sans text-2xl font-bold text-primary">
          Verify Your Number
        </h1>
        <p className="text-on-surface-variant text-sm">
          Enter the 6-digit code sent to +233{phone}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-lg">
        <div className="flex justify-center gap-sm">
          {otp.map((digit, i) => (
            <input
              key={`otp-${i.toString()}`}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center bg-surface border border-outline-variant rounded-lg text-xl font-mono text-primary focus:outline-none focus:border-primary transition-colors"
            />
          ))}
        </div>

        {error && <p className="text-error text-sm text-center">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        {resendTimer > 0 ? (
          `Resend code in ${resendTimer}s`
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:underline"
          >
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}
