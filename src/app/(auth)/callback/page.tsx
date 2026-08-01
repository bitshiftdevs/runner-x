"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { APP_NAME } from "@/constants";

/**
 * OAuth callback page — receives tokens from the backend OAuth redirect.
 *
 * The backend's `/auth/google/callback` endpoint redirects here with
 * `?access_token=...&refresh_token=...` after successful Google sign-in,
 * or with `?error=...&error_description=...` on failure.
 *
 * This client component reads the params, POSTs the tokens to our
 * `/api/auth/session` server action (which stores them in httpOnly cookies),
 * then navigates to the admin dashboard.
 */
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const processCallback = useCallback(async () => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const description =
        searchParams.get("error_description") ?? "Authentication failed";
      setError(description);
      return;
    }

    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError("Missing authentication tokens. Please try again.");
      return;
    }

    try {
      // Store tokens in httpOnly cookies via the server action
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(body.error ?? "Failed to complete sign-in.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }, [searchParams, router]);

  useEffect(() => {
    processCallback();
  }, [processCallback]);

  if (error) {
    return (
      <div className="space-y-lg text-center">
        <h1 className="font-sans text-2xl font-bold text-primary tracking-tighter">
          {APP_NAME}
        </h1>
        <p className="text-error text-sm">{error}</p>
        <a
          href="/login"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm text-on-primary"
        >
          Back to Login
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-lg text-center">
      <h1 className="font-sans text-2xl font-bold text-primary tracking-tighter">
        {APP_NAME}
      </h1>
      <p className="animate-pulse text-primary font-mono text-sm">
        Completing sign-in…
      </p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <p className="animate-pulse text-primary font-mono text-sm">
            Loading…
          </p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
