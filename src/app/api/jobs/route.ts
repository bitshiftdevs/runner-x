import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { calculatePricing } from "@/lib/pricing";
import type { JobCategory, UrgencyLevel } from "@/types";

async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value ?? null;
}

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ jobs: [] }, { status: 401 });

  const url = new URL(request.url);
  const mine = url.searchParams.get("mine");
  const category = url.searchParams.get("category");
  const urgency = url.searchParams.get("urgency");

  let query = db.select().from(jobs).orderBy(desc(jobs.createdAt)).$dynamic();

  if (mine) {
    query = query.where(or(eq(jobs.requesterId, userId), eq(jobs.runnerId, userId)));
  }

  const result = await query.limit(50);

  let filtered = result;
  if (category) filtered = filtered.filter((j) => j.category === category);
  if (urgency) filtered = filtered.filter((j) => j.urgency === urgency);

  return NextResponse.json({ jobs: filtered });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    title,
    description,
    category,
    urgency,
    vendorName,
    pickupLocation,
    deliveryLocation,
    distanceKm,
  } = body;

  const pricing = calculatePricing(
    distanceKm ?? 1.5,
    (urgency ?? "normal") as UrgencyLevel,
    (category ?? "general_errands") as JobCategory,
  );

  const [job] = await db
    .insert(jobs)
    .values({
      requesterId: userId,
      title,
      description,
      category,
      urgency: urgency ?? "normal",
      vendorName: vendorName ?? null,
      pickupLocation,
      deliveryLocation,
      baseFee: pricing.baseFee.toString(),
      distanceFee: pricing.distanceFee.toString(),
      urgencyFee: pricing.urgencyFee.toString(),
      categoryFee: pricing.categoryFee.toString(),
      totalFee: pricing.totalFee.toString(),
      runnerEarnings: pricing.runnerEarnings.toString(),
      platformFee: pricing.platformFee.toString(),
      status: "posted",
    })
    .returning();

  return NextResponse.json({ job });
}
