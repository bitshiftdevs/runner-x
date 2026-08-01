import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { REMOVE_PAYMENT_METHOD } from "@/lib/graphql/operations";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await gqlRequest<{ removePaymentMethod: boolean }>(REMOVE_PAYMENT_METHOD, {
      id,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const be = err as BackendError;
    const status =
      be.kind === "unauthenticated"
        ? 401
        : be.kind === "not_found"
          ? 404
          : be.kind === "permission_denied"
            ? 403
            : 400;
    return NextResponse.json({ error: be.message }, { status });
  }
}
