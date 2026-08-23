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
  dailyJobs: number;
  pendingVerifications: number;
  activeDisputes: number;
  totalPayments: number;
  totalWalletBalance: number;
  activeWallets: number;
};

export async function GET() {
  try {
    const data = await gqlRequest<{ platformStats: PlatformStats }>(
      PLATFORM_STATS,
    );
    const s = data.platformStats;
    return NextResponse.json({
      pendingVerifications: s.pendingVerifications,
      activeDisputes: s.activeDisputes,
      dailyJobs: s.dailyJobs,
      totalUsers: s.totalUsers,
      totalRevenue: s.totalRevenue,
      totalPayments: s.totalPayments,
      totalWalletBalance: s.totalWalletBalance,
      activeWallets: s.activeWallets,
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
