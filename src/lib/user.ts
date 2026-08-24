import "server-only";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import {
  type BackendProfile,
  ME_QUERY,
  type MeQueryData,
} from "@/lib/graphql/auth";
import { getAccessToken } from "@/lib/session";

function isBackendError(value: unknown): value is BackendError {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    typeof (value as { kind: unknown }).kind === "string"
  );
}

export async function getServerUser(): Promise<BackendProfile | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const data = await gqlRequest<MeQueryData>(ME_QUERY);
    return data.me;
  } catch (err) {
    if (isBackendError(err) && err.kind === "unauthenticated") return null;
    throw err;
  }
}
