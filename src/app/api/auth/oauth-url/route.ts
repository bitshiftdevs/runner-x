import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

export async function GET(request: Request) {
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/callback`;

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
