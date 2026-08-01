import { NextResponse } from "next/server";

/**
 * The backend has no `allPayments` admin query yet, so this endpoint
 * returns an empty page. Add a matching Kotlin fetcher/query when the
 * admin dashboard needs payment listings; until then the admin UI should
 * degrade gracefully to an empty state.
 */
export async function GET() {
  return NextResponse.json({
    payments: [],
    total: 0,
    unsupported: true,
    reason: "Backend does not expose an admin payments listing yet.",
  });
}
