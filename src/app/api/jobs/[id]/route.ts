import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendErrand, toClientJob } from "@/lib/graphql/adapters";
import { DELETE_ERRAND, ERRAND_QUERY } from "@/lib/graphql/operations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const data = await gqlRequest<{ errand: BackendErrand | null }>(
      ERRAND_QUERY,
      { id },
    );
    if (!data.errand) {
      return NextResponse.json({ job: null }, { status: 404 });
    }
    return NextResponse.json({ job: toClientJob(data.errand) });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { job: null, error: be.message },
      { status: be.kind === "not_found" ? 404 : 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await gqlRequest<{ deleteErrand: boolean }>(DELETE_ERRAND, {
      errandId: id,
    });
    return NextResponse.json({ ok: true });
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
