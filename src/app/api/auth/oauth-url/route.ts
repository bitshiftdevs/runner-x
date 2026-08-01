import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

/**
 * Returns the Google OAuth consent URL from the backend.
 * The frontend redirects the browser to this URL to start the OAuth flow.
 *
 * The `redirect_uri` parameter tells the backend where to redirect after
 * issuing tokens — in this case, back to our Next.js `/auth/callback` page.
 */
export async function GET(request: Request) {
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  // Build the redirect_uri that the backend will redirect to after OAuth
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/auth/callback`;

  try {
    const res = await fetch(
      `${backendUrl}/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`,
    );

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      return NextResponse.json(
        { error: body.error ?? "Failed to get OAuth URL" },
        { status: res.status },
      );
    }

    const data = (await res.json()) as { url: string };
    return NextResponse.json({ url: data.url });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to connect to backend",
      },
      { status: 502 },
    );
  }
}
