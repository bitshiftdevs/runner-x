import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendErrand, toClientJob } from "@/lib/graphql/adapters";
import { ERRAND_QUERY, UPDATE_ERRAND_STATUS } from "@/lib/graphql/operations";

const NEXT: Record<string, string> = {
  accepted: "heading_to_vendor",
  heading_to_vendor: "at_vendor",
  at_vendor: "heading_to_delivery",
  heading_to_delivery: "delivered",
};

/**
 * Advances an errand one stage forward. The backend state machine enforces
 * the transition — we just look up the next stage locally so we can return
 * a clean 400 without a round-trip.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const current = await gqlRequest<{ errand: BackendErrand | null }>(
      ERRAND_QUERY,
      { id },
    );
    if (!current.errand) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const next = NEXT[current.errand.status];
    if (!next) {
      return NextResponse.json(
        { error: "Cannot advance from this stage" },
        { status: 400 },
      );
    }
    const data = await gqlRequest<{ updateErrandStatus: BackendErrand }>(
      UPDATE_ERRAND_STATUS,
      { errandId: id, status: next },
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
