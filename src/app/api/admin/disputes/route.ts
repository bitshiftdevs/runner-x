import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const disputes = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "disputed"))
    .orderBy(desc(jobs.updatedAt))
    .limit(20);

  return NextResponse.json({ disputes });
}
