"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Implicit flow: Supabase auto-parses the hash fragment on init
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error || !session) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/set-session", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        await supabase.auth.signOut();
        router.push("/login?error=unauthorized");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="animate-pulse text-primary font-mono text-sm">
        Authenticating…
      </p>
    </div>
  );
}
