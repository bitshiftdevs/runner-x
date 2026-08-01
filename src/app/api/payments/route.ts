import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendPayment, toClientPayment } from "@/lib/graphql/adapters";
import { INITIATE_ERRAND_PAYMENT, MY_PAYMENTS } from "@/lib/graphql/operations";

export async function GET() {
  try {
    const data = await gqlRequest<{ myPayments: BackendPayment[] }>(
      MY_PAYMENTS,
    );
    return NextResponse.json({
      payments: data.myPayments.map(toClientPayment),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { payments: [], error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 500 },
    );
  }
}

/**
 * Initiates a Moolre payment for a specific errand. Body: `{ jobId, channel,
 * payer }`. The backend creates the payment row and returns it in `pending`
 * status; the Moolre callback later flips it to `success` / `failed`.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    jobId?: string;
    channel?: string;
    payer?: string;
  };
  if (!body.jobId || !body.channel || !body.payer) {
    return NextResponse.json(
      { error: "jobId, channel, and payer are required" },
      { status: 400 },
    );
  }
  try {
    const data = await gqlRequest<{ initiateErrandPayment: BackendPayment }>(
      INITIATE_ERRAND_PAYMENT,
      { errandId: body.jobId, channel: body.channel, payer: body.payer },
    );
    return NextResponse.json({
      payment: toClientPayment(data.initiateErrandPayment),
    });
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
