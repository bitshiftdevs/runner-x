import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/session";

/**
 * Returns the caller's access token so the browser can open a GraphQL
 * subscription WebSocket to the backend. The token is otherwise stored in
 * an httpOnly cookie and never leaves the server.
 *
 * Security note: this trades a small amount of XSS exposure for a much
 * simpler realtime story than a Next.js WebSocket proxy. Any attacker who
 * can call this route already has full same-origin fetch access to every
 * authenticated /api/* endpoint, so the incremental risk is negligible.
 */
export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ token: null }, { status: 401 });
  }
  return NextResponse.json({ token });
}
