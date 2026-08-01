import "server-only";

import { cookies } from "next/headers";

const ACCESS_COOKIE = "rx_access_token";
const REFRESH_COOKIE = "rx_refresh_token";

const isProd = process.env.NODE_ENV === "production";

/**
 * Cookie shape shared by all session helpers so we set the same flags
 * whenever the tokens are written or cleared.
 */
const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
};

/**
 * The backend returns an access token good for one hour and a refresh
 * token good for seven days. Persist the refresh token for its full
 * lifetime and let the access token expire on its own — we'll rotate it
 * with the refresh flow when the backend returns UNAUTHENTICATED.
 */
const ACCESS_MAX_AGE_S = 60 * 60; // 1 hour
const REFRESH_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value ?? null;
}

export async function setSessionCookies(params: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, params.accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_MAX_AGE_S,
  });
  jar.set(REFRESH_COOKIE, params.refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_MAX_AGE_S,
  });
}

export async function clearSessionCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}
