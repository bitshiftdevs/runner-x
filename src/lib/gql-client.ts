import "server-only";

import { GraphQLClient, gql } from "graphql-request";

import { toBackendError } from "@/lib/gql-errors";
import {
  clearSessionCookies,
  getAccessToken,
  getRefreshToken,
  setSessionCookies,
} from "@/lib/session";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!backendUrl) {
  // Surface config errors at import time rather than the first request.
  throw new Error(
    "NEXT_PUBLIC_BACKEND_URL is not set. Add it to apps/web/.env (see .env.example).",
  );
}

const endpoint = `${backendUrl.replace(/\/$/, "")}/graphql`;

const REFRESH_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

type RefreshResponse = {
  refreshToken: { accessToken: string; refreshToken: string };
};

/**
 * Coalesces concurrent refresh calls into one. When several server actions
 * discover an expired access token in parallel, only the first one hits the
 * backend; the rest await the same promise.
 */
let refreshInFlight: Promise<string | null> | null = null;

function buildClient(accessToken: string | null): GraphQLClient {
  return new GraphQLClient(endpoint, {
    headers: accessToken ? { authorization: `Bearer ${accessToken}` } : {},
  });
}

async function attemptRefresh(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const refresh = await getRefreshToken();
      if (!refresh) return null;

      const client = buildClient(null);
      const data = await client.request<RefreshResponse>(REFRESH_MUTATION, {
        refreshToken: refresh,
      });
      await setSessionCookies({
        accessToken: data.refreshToken.accessToken,
        refreshToken: data.refreshToken.refreshToken,
      });
      return data.refreshToken.accessToken;
    } catch {
      // Refresh failed — clear cookies so the next request forces a login.
      await clearSessionCookies();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/**
 * Executes a GraphQL request against the custom backend, transparently
 * refreshing the access token on UNAUTHENTICATED responses. Throws a typed
 * {@link BackendError} on failure so callers can branch without inspecting
 * the raw graphql-request error shape.
 */
export async function gqlRequest<TData, TVars extends object = object>(
  query: string,
  variables?: TVars,
): Promise<TData> {
  const accessToken = await getAccessToken();

  try {
    return await buildClient(accessToken).request<TData>(query, variables);
  } catch (err) {
    const classified = toBackendError(err);
    if (classified.kind !== "unauthenticated") {
      throw classified;
    }

    const refreshed = await attemptRefresh();
    if (!refreshed) throw classified;

    try {
      return await buildClient(refreshed).request<TData>(query, variables);
    } catch (retryErr) {
      throw toBackendError(retryErr);
    }
  }
}

export { gql };
