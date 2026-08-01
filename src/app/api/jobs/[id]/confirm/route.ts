import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendErrand, toClientJob } from "@/lib/graphql/adapters";
import { UPDATE_ERRAND_STATUS } from "@/lib/graphql/operations";

/**
 * Requester confirms delivery — the backend enforces the delivered→confirmed
 * transition (and triggers the wallet credit for the runner).
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const data = await gqlRequest<{ updateErrandStatus: BackendErrand }>(
      UPDATE_ERRAND_STATUS,
      { errandId: id, status: "confirmed" },
    );
    return NextResponse.json({ job: toClientJob(data.updateErrandStatus) });
  } catch (err) {
    const be = err as BackendError;
    const status =
      be.kind === "unauthenticated"
        ? 401
        : be.kind === "permission_denied"
          ? 403
          : be.kind === "not_found"
            ? 404
            : 400;
    return NextResponse.json({ error: be.message }, { status });
  }
}
