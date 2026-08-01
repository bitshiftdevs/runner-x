import "server-only";

import { gqlRequest } from "@/lib/gql-client";
import {
  type BackendProfile,
  ME_QUERY,
  type MeQueryData,
} from "@/lib/graphql/auth";
import { type BackendError } from "@/lib/gql-errors";
import { getAccessToken } from "@/lib/session";

function isBackendError(value: unknown): value is BackendError {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    typeof (value as { kind: unknown }).kind === "string"
  );
}

/**
 * Resolves the currently authenticated user by calling the backend `me`
 * query with whatever access token is on the request. Returns `null` when
 * no session cookie is present or the backend rejects the token.
 *
 * Use inside server components and route handlers to gate protected pages.
 */
export async function getServerUser(): Promise<BackendProfile | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const data = await gqlRequest<MeQueryData>(ME_QUERY);
    return data.me;
  } catch (err) {
    // gqlRequest already normalized failures to BackendError. A stale
    // access token surfaces as unauthenticated — treat as signed-out.
    if (isBackendError(err) && err.kind === "unauthenticated") return null;
    throw err;
  }
}
