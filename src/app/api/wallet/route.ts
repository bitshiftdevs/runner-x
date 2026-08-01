import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { type BackendWallet, toClientWallet } from "@/lib/graphql/adapters";
import { MY_WALLET } from "@/lib/graphql/operations";

export async function GET() {
  try {
    const data = await gqlRequest<{ myWallet: BackendWallet | null }>(
      MY_WALLET,
    );
    if (!data.myWallet) return NextResponse.json({ wallet: null });
    return NextResponse.json({ wallet: toClientWallet(data.myWallet) });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { wallet: null, error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 500 },
    );
  }
}
