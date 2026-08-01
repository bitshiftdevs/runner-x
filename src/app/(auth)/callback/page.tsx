import { redirect } from "next/navigation";

/**
 * Legacy Supabase OAuth redirect target. The custom backend does not use a
 * server-side callback — Google Identity Services returns the ID token
 * client-side in `/login`. Any residual traffic here bounces back to the
 * login screen.
 */
export default function ObsoleteCallbackPage(): never {
  redirect("/login");
}
