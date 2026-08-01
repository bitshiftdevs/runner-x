import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendWalletTx, toClientWalletTx } from "@/lib/graphql/adapters";
import {
  REQUEST_WITHDRAWAL,
  WALLET_TRANSACTIONS,
} from "@/lib/graphql/operations";
import { ghsToPesewas } from "@/lib/money";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "20");
  const offset = Number(url.searchParams.get("offset") ?? "0");
  try {
    const data = await gqlRequest<{ walletTransactions: BackendWalletTx[] }>(
      WALLET_TRANSACTIONS,
      { limit, offset },
    );
    return NextResponse.json({
      transactions: data.walletTransactions.map(toClientWalletTx),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { transactions: [], error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 500 },
    );
  }
}

/**
 * Request a withdrawal. Client sends `{ amount, paymentMethodId }` where
 * `amount` is in decimal cedis (legacy contract); we convert to pesewas
 * before calling the backend mutation.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    amount?: number;
    paymentMethodId?: string;
  };
  if (!body.amount || !body.paymentMethodId) {
    return NextResponse.json(
      { error: "amount and paymentMethodId are required" },
      { status: 400 },
    );
  }
  try {
    const data = await gqlRequest<{ requestWithdrawal: BackendWalletTx }>(
      REQUEST_WITHDRAWAL,
      {
        amount: ghsToPesewas(body.amount),
        paymentMethodId: body.paymentMethodId,
      },
    );
    return NextResponse.json({
      transaction: toClientWalletTx(data.requestWithdrawal),
    });
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
    return NextResponse.json(
      { error: be.message, kind: be.kind ?? "internal" },
      { status },
    );
  }
}
