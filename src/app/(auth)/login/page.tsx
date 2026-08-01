"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

import { APP_NAME } from "@/constants";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type GoogleCredentialResponse = { credential: string };

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: {
      type: "standard";
      theme: "outline" | "filled_blue" | "filled_black";
      size: "large" | "medium" | "small";
      shape: "rectangular" | "pill";
      text: "signin_with" | "signup_with" | "continue_with" | "signin";
      width?: number;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const buttonHost = useRef<HTMLDivElement | null>(null);

  const handleCredential = useCallback(
    async ({ credential }: GoogleCredentialResponse) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credential }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          setError(body.error ?? "Sign-in failed. Please try again.");
          setLoading(false);
          return;
        }
        router.push("/admin");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed.");
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (!scriptReady || !clientId || !buttonHost.current) return;
    const gis = window.google?.accounts.id;
    if (!gis) return;
    gis.initialize({ client_id: clientId, callback: handleCredential });
    buttonHost.current.replaceChildren();
    gis.renderButton(buttonHost.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "signin_with",
      width: 320,
    });
  }, [scriptReady, handleCredential]);

  return (
    <div className="space-y-xl">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="text-center space-y-sm">
        <h1 className="font-sans text-4xl font-bold text-primary tracking-tighter">
          {APP_NAME}
        </h1>
        <p className="text-on-surface-variant font-mono text-sm">
          Admin Portal
        </p>
      </div>

      <div className="space-y-lg flex flex-col items-center">
        {!clientId && (
          <p className="text-error text-sm text-center font-mono">
            NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.
          </p>
        )}
        <div ref={buttonHost} aria-label="Sign in with Google" />
        {loading && (
          <p className="animate-pulse text-primary font-mono text-sm">
            Signing you in…
          </p>
        )}
        {error && <p className="text-error text-sm text-center">{error}</p>}
      </div>

      <p className="text-center text-xs text-on-surface-variant font-mono">
        Admin access only. Unauthorized accounts will be rejected.
      </p>
    </div>
  );
}
