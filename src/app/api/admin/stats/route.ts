import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pending, disputes, daily] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }).eq("student_id_status", "pending").not("avatar_url", "is", null),
    db.from("jobs").select("*", { count: "exact", head: true }).eq("status", "disputed"),
    db.from("jobs").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
  ]);

  return NextResponse.json({
    pendingVerifications: pending.count ?? 0,
    activeDisputes: disputes.count ?? 0,
    dailyJobs: daily.count ?? 0,
  });
}
