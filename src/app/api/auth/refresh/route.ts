import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";

import { REFRESH_TOKEN, type RefreshTokenData } from "@/lib/graphql/auth";
import { toBackendError } from "@/lib/gql-errors";
import {
  clearSessionCookies,
  getRefreshToken,
  setSessionCookies,
} from "@/lib/session";

/**
 * Rotates the access + refresh cookies. Called by client code when it wants
 * to proactively refresh (e.g. a long-lived tab that just came back into
 * focus) — background refresh on 401 is already handled inside
 * `gqlRequest`. Uses its own bare GraphQLClient to avoid recursion.
 */
export async function POST() {
  const refresh = await getRefreshToken();
  if (!refresh) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "")}/graphql`;
  try {
    const data = await new GraphQLClient(endpoint).request<RefreshTokenData>(
      REFRESH_TOKEN,
      { refreshToken: refresh },
    );
    await setSessionCookies({
      accessToken: data.refreshToken.accessToken,
      refreshToken: data.refreshToken.refreshToken,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    await clearSessionCookies();
    const be = toBackendError(err);
    return NextResponse.json(
      { error: be.message, kind: be.kind },
      { status: 401 },
    );
  }
}
