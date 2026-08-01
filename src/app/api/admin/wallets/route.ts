import { NextResponse } from "next/server";

/**
 * The backend has no `allWallets` admin query yet. Same story as
 * /api/admin/payments — return an empty page until the fetcher lands.
 */
export async function GET() {
  return NextResponse.json({
    wallets: [],
    total: 0,
    unsupported: true,
    reason: "Backend does not expose an admin wallet listing yet.",
  });
}
