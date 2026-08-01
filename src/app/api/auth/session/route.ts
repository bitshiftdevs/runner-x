import { NextResponse } from "next/server";

import { type BackendError, toBackendError } from "@/lib/gql-errors";
import { gqlRequest } from "@/lib/gql-client";
import {
  SIGN_IN_WITH_GOOGLE,
  type SignInWithGoogleData,
} from "@/lib/graphql/auth";
import { setSessionCookies } from "@/lib/session";
import { getServerUser } from "@/lib/user";

/**
 * Reads the current session — used by the client shell to know whether
 * to render the "sign in" state or the dashboard state.
 */
export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}

/**
 * Stores tokens in httpOnly cookies. Called from the /auth/callback page
 * after the backend OAuth redirect delivers the token pair.
 *
 * Accepts either:
 * - { accessToken, refreshToken } — from the server-side OAuth callback
 * - { idToken } — legacy: exchanges via backend signInWithGoogle mutation (kept for backward compat)
 */
export async function POST(request: Request) {
  let body: { accessToken?: string; refreshToken?: string; idToken?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // New OAuth flow: tokens are already issued by the backend callback
  if (body.accessToken && body.refreshToken) {
    await setSessionCookies({
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
    });
    return NextResponse.json({ ok: true });
  }

  // Legacy: exchange ID token via backend GraphQL mutation
  if (body.idToken) {
    try {
      const data = await gqlRequest<SignInWithGoogleData>(SIGN_IN_WITH_GOOGLE, {
        idToken: body.idToken,
      });
      await setSessionCookies({
        accessToken: data.signInWithGoogle.accessToken,
        refreshToken: data.signInWithGoogle.refreshToken,
      });
      return NextResponse.json({ user: data.signInWithGoogle.profile });
    } catch (err) {
      const be = err as BackendError;
      const status = be.kind === "unauthenticated" ? 401 : 500;
      return NextResponse.json(
        { error: be.message ?? "Sign-in failed", kind: be.kind ?? "internal" },
        { status },
      );
    }
  }

  return NextResponse.json(
    { error: "Either accessToken+refreshToken or idToken is required" },
    { status: 400 },
  );
}
