"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { APP_NAME, APP_TAGLINE } from "@/constants";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState( "" );
  const [error, setError] = useState( "" );
  const [loading, setLoading] = useState( false );

  async function handleSubmit( e: React.FormEvent ) {
    e.preventDefault();
    setError( "" );

    const cleaned = phone.replace( /\D/g, "" );
    if ( cleaned.length < 9 ) {
      setError( "Enter a valid Ghanaian phone number" );
      return;
    }

    setLoading( true );
    try {
      const res = await fetch( "/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( { phone: cleaned } ),
      } );
      const data = await res.json();
      if ( !res.ok ) {
        setError( data.error ?? "Failed to send OTP" );
        return;
      }
      router.push( `/verify?phone=${encodeURIComponent( cleaned )}` );
    } catch {
      setError( "Network error. Try again." );
    } finally {
      setLoading( false );
    }
  }

  return (
    <div className="space-y-xl">
      <div className="text-center space-y-sm">
        <h1 className="font-sans text-4xl font-bold text-primary tracking-tighter">
          {APP_NAME}
        </h1>
        <p className="text-on-surface-variant">{APP_TAGLINE}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-lg">
        <div className="space-y-sm">
          <label
            htmlFor="phone"
            className="font-mono text-xs text-on-surface-variant uppercase"
          >
            Phone Number
          </label>
          <div className="flex items-center gap-sm">
            <span className="bg-surface-container-high px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant font-mono text-sm">
              +233
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="24 123 4567"
              value={phone}
              onChange={( e ) => setPhone( e.target.value )}
              className="flex-1 bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface font-sans focus:outline-none focus:border-primary transition-colors"
              autoComplete="tel"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending..." : "Get OTP"}
        </Button>
      </form>

      <p className="text-center text-xs text-on-surface-variant">
        By continuing, you agree to Runner_X&apos;s Terms of Service
      </p>
    </div>
  );
}
