"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { APP_NAME } from "@/constants";

/**
 * Login page — initiates the server-side Google OAuth flow.
 *
 * 1. Clicks "Sign in with Google" button.
 * 2. Fetches the OAuth consent URL from our backend via the /api/auth/session
 *    server action (which calls GET /auth/google/url on the backend).
 * 3. Redirects the browser to Google's consent page.
 * 4. After consent, Google redirects to our backend callback, which issues
 *    tokens and redirects to /auth/callback?access_token=...&refresh_token=...
 * 5. The /auth/callback page stores the tokens in httpOnly cookies and
 *    redirects to /admin.
 */
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/session", { method: "GET" });
      if (res.ok) {
        // Already authenticated, go to admin
        router.push("/admin");
        router.refresh();
        return;
      }

      // Get the OAuth URL from the backend
      const urlRes = await fetch("/api/auth/oauth-url");
      if (!urlRes.ok) {
        const body = (await urlRes.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(body.error ?? "Failed to start sign-in. Please try again.");
        setLoading(false);
        return;
      }
      const { url } = (await urlRes.json()) as { url: string };
      // Redirect to Google's consent page
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-xl">
      <div className="text-center space-y-sm">
        <h1 className="font-sans text-4xl font-bold text-primary tracking-tighter">
          {APP_NAME}
        </h1>
        <p className="text-on-surface-variant font-mono text-sm">
          Admin Portal
        </p>
      </div>

      <div className="space-y-lg flex flex-col items-center">
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="flex items-center gap-3 rounded-md border border-outline bg-surface px-6 py-3 text-sm font-medium text-on-surface shadow-sm transition-colors hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Google"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading ? "Redirecting…" : "Sign in with Google"}
        </button>
        {error && <p className="text-error text-sm text-center">{error}</p>}
      </div>

      <p className="text-center text-xs text-on-surface-variant font-mono">
        Admin access only. Unauthorized accounts will be rejected.
      </p>
    </div>
  );
}
