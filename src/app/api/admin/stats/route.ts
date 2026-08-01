import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { PLATFORM_STATS } from "@/lib/graphql/operations";

type PlatformStats = {
  totalUsers: number;
  totalErrands: number;
  activeErrands: number;
  completedErrands: number;
  totalRevenue: number;
};

/**
 * Backend `platformStats` returns a compact summary; the client dashboard
 * expects the fuller (legacy) shape. Extra fields default to 0 for now —
 * they'll be filled in once dedicated queries land on the backend
 * (`totalWalletBalance`, `activeWallets`, `pendingVerifications`, ...).
 */
export async function GET() {
  try {
    const data = await gqlRequest<{ platformStats: PlatformStats }>(
      PLATFORM_STATS,
    );
    const s = data.platformStats;
    return NextResponse.json({
      pendingVerifications: 0,
      activeDisputes: 0,
      dailyJobs: 0,
      totalUsers: s.totalUsers,
      totalRevenue: s.totalRevenue,
      totalPayments: 0,
      totalWalletBalance: 0,
      activeWallets: 0,
      totalErrands: s.totalErrands,
      activeErrands: s.activeErrands,
      completedErrands: s.completedErrands,
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "permission_denied" ? 403 : 500 },
    );
  }
}
