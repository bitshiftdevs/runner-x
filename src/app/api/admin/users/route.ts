import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import {
  type BackendProfileRaw,
  toClientProfile,
} from "@/lib/graphql/adapters";
import { ALL_USERS } from "@/lib/graphql/operations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "50");
  const offset = Number(searchParams.get("offset") ?? "0");
  const size = limit;
  const page = Math.floor(offset / limit);

  try {
    const data = await gqlRequest<{ allUsers: BackendProfileRaw[] }>(
      ALL_USERS,
      { search: search ?? null, page, size },
    );
    const users = data.allUsers.map(toClientProfile);
    return NextResponse.json({ users, total: users.length });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { users: [], total: 0, error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
