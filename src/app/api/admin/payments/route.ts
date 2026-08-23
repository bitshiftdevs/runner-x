import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { ALL_PAYMENTS } from "@/lib/graphql/operations";
import { type BackendPayment, toClientPayment } from "@/lib/graphql/adapters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");
  const size = limit;
  const page = Math.floor(offset / limit);

  try {
    const data = await gqlRequest<{ allPayments: BackendPayment[] }>(
      ALL_PAYMENTS,
      { status: status ?? null, page, size },
    );
    const payments = data.allPayments.map(toClientPayment);
    return NextResponse.json({ payments, total: payments.length });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { payments: [], total: 0, error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
