import { GraphQLClient } from "graphql-request";
import { NextResponse } from "next/server";
import { toBackendError } from "@/lib/gql-errors";
import { REFRESH_TOKEN, type RefreshTokenData } from "@/lib/graphql/auth";
import {
  clearSessionCookies,
  getRefreshToken,
  setSessionCookies,
} from "@/lib/session";

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
