import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pending, disputes, daily, totalUsers, payments, wallets] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }).eq("student_id_status", "pending").not("avatar_url", "is", null),
    db.from("jobs").select("*", { count: "exact", head: true }).eq("status", "disputed"),
    db.from("jobs").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("payments").select("amount, status"),
    db.from("runner_wallets").select("available_balance, pending_balance, total_earned"),
  ]);

  const successPayments = (payments.data ?? []).filter((p: { status: string }) => p.status === "success");
  const totalRevenue = successPayments.reduce((sum: number, p: { amount: number }) => sum + Number(p.amount), 0);

  const walletData = wallets.data ?? [];
  const totalWalletBalance = walletData.reduce((sum: number, w: { available_balance: number; pending_balance: number }) => sum + Number(w.available_balance) + Number(w.pending_balance), 0);

  return NextResponse.json({
    pendingVerifications: pending.count ?? 0,
    activeDisputes: disputes.count ?? 0,
    dailyJobs: daily.count ?? 0,
    totalUsers: totalUsers.count ?? 0,
    totalRevenue,
    totalPayments: (payments.data ?? []).length,
    totalWalletBalance,
    activeWallets: walletData.length,
  });
}
