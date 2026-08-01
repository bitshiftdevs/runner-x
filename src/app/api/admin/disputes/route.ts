import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendErrand, toClientJob } from "@/lib/graphql/adapters";
import { DISPUTED_ERRANDS } from "@/lib/graphql/operations";

export async function GET() {
  try {
    const data = await gqlRequest<{ disputedErrands: BackendErrand[] }>(
      DISPUTED_ERRANDS,
    );
    return NextResponse.json({
      disputes: data.disputedErrands.map(toClientJob),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { disputes: [], error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
