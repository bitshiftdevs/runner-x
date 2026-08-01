import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { RESOLVE_DISPUTE } from "@/lib/graphql/operations";

/**
 * Resolves a disputed errand. Body accepts optional `resolution` note and
 * `refundRequester` flag; the backend handles the refund + wallet reversal.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    resolution?: string;
    refundRequester?: boolean;
  };

  try {
    await gqlRequest(RESOLVE_DISPUTE, {
      errandId: id,
      resolution: body.resolution ?? body.action ?? "resolved",
      refundRequester: body.refundRequester ?? false,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
