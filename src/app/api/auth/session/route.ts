import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import {
  SIGN_IN_WITH_GOOGLE,
  type SignInWithGoogleData,
} from "@/lib/graphql/auth";
import { type BackendError } from "@/lib/gql-errors";
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
 * Trades a Google ID token for a backend-issued access + refresh token
 * pair. The tokens are stored in httpOnly cookies by the shared
 * `setSessionCookies` helper so nothing sensitive leaves the server.
 */
export async function POST(request: Request) {
  let idToken: string | undefined;
  try {
    const body = (await request.json()) as { idToken?: string };
    idToken = body.idToken;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ error: "idToken is required" }, { status: 400 });
  }

  try {
    const data = await gqlRequest<SignInWithGoogleData>(SIGN_IN_WITH_GOOGLE, {
      idToken,
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
