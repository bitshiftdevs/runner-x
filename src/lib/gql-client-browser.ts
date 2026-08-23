/**
 * Client-side GraphQL client that talks directly to the backend.
 *
 * Flow:
 * 1. Fetch the access token from /api/auth/ws-token (httpOnly cookie → server → JSON)
 * 2. Send the GraphQL request to NEXT_PUBLIC_BACKEND_URL/graphql with Bearer auth
 * 3. On UNAUTHENTICATED, call /api/auth/refresh to rotate cookies, then retry once
 */

import { GraphQLClient } from "graphql-request";

import { toBackendError, type BackendError } from "@/lib/gql-errors";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!backendUrl) {
  throw new Error(
    "NEXT_PUBLIC_BACKEND_URL is not set. Add it to .env (see .env.example).",
  );
}

const endpoint = `${backendUrl.replace(/\/$/, "")}/graphql`;

// ── Token management ───────────────────────────────────────────────────

/** Cached access token. Reset on 401 or tab focus. */
let cachedToken: string | null = null;

/**
 * Returns a valid access token, fetching from the server endpoint if needed.
 * The token is cached in memory — call `invalidateToken()` on 401 to force
 * a re-fetch.
 */
async function getAccessToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  try {
    const res = await fetch("/api/auth/ws-token");
    if (!res.ok) return null;
    const data = (await res.json()) as { token: string | null };
    cachedToken = data.token;
    return cachedToken;
  } catch {
    return null;
  }
}

/** Force the next request to re-fetch the token from the server. */
export function invalidateToken() {
  cachedToken = null;
}

// ── Refresh ────────────────────────────────────────────────────────────

/**
 * Calls the server-side refresh endpoint to rotate the httpOnly cookies,
 * then fetches the new access token.
 */
async function refreshAndRetry(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) return null;
    // After refresh, the server has set new cookies — invalidate cache and re-fetch
    invalidateToken();
    return getAccessToken();
  } catch {
    return null;
  }
}

// ── Client construction ────────────────────────────────────────────────

function buildClient(token: string | null): GraphQLClient {
  return new GraphQLClient(endpoint, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Executes a GraphQL request against the backend, transparently refreshing
 * the access token on UNAUTHENTICATED responses.
 *
 * Throws a typed {@link BackendError} on failure.
 */
export async function gqlFetch<TData, TVars extends object = object>(
  query: string,
  variables?: TVars,
): Promise<TData> {
  const token = await getAccessToken();

  try {
    return await buildClient(token).request<TData>(query, variables);
  } catch (err) {
    const classified = toBackendError(err);
    if (classified.kind !== "unauthenticated") {
      throw classified;
    }

    // Token might have expired — try a refresh
    const newToken = await refreshAndRetry();
    if (!newToken) throw classified;

    try {
      return await buildClient(newToken).request<TData>(query, variables);
    } catch (retryErr) {
      throw toBackendError(retryErr);
    }
  }
}
