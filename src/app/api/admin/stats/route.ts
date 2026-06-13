import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobs, profiles } from "@/db/schema";
import { eq, and, gte, isNotNull, count } from "drizzle-orm";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pending] = await db.select({ count: count() }).from(profiles)
    .where(and(isNotNull(profiles.studentIdUrl), eq(profiles.studentIdVerified, false)));

  const [disputes] = await db.select({ count: count() }).from(jobs)
    .where(eq(jobs.status, "disputed"));

  const [daily] = await db.select({ count: count() }).from(jobs)
    .where(gte(jobs.createdAt, today));

  return NextResponse.json({
    pendingVerifications: Number(pending.count),
    activeDisputes: Number(disputes.count),
    dailyJobs: Number(daily.count),
  });
}
