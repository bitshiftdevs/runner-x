import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { ALL_WALLETS } from "@/lib/graphql/operations";
import { type BackendWallet, toClientWallet } from "@/lib/graphql/adapters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");
  const size = limit;
  const page = Math.floor(offset / limit);

  try {
    const data = await gqlRequest<{ allWallets: BackendWallet[] }>(
      ALL_WALLETS,
      { page, size },
    );
    const wallets = data.allWallets.map(toClientWallet);
    return NextResponse.json({ wallets, total: wallets.length });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { wallets: [], total: 0, error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
