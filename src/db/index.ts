import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const db = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) throw new Error("Supabase env vars not set");
      client = createClient(url, key);
    }
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
