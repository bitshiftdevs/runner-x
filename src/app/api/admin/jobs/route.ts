import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendErrand, toClientJob } from "@/lib/graphql/adapters";
import { ALL_ERRANDS } from "@/lib/graphql/operations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");
  const size = limit;
  const page = Math.floor(offset / limit);

  try {
    const data = await gqlRequest<{ allErrands: BackendErrand[] }>(
      ALL_ERRANDS,
      { status: status ?? null, page, size },
    );
    const jobs = data.allErrands.map(toClientJob);
    return NextResponse.json({ jobs, total: jobs.length });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { jobs: [], total: 0, error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
