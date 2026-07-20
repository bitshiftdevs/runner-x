import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
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

  let query = db.from("jobs").select("*").order("created_at", { ascending: false }).limit(50);

  if (mine) {
    query = query.or(`requester_id.eq.${userId},runner_id.eq.${userId}`);
  }
  if (category) query = query.eq("category", category);
  if (urgency) query = query.eq("urgency", urgency);

  const { data: jobs } = await query;
  return NextResponse.json({ jobs: jobs ?? [] });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, description, category, urgency, vendorName, pickupLocation, deliveryLocation, distanceKm } = body;

  const pricing = calculatePricing(
    distanceKm ?? 1.5,
    (urgency ?? "normal") as UrgencyLevel,
    (category ?? "general_errands") as JobCategory,
  );

  const { data: job } = await db
    .from("jobs")
    .insert({
      requester_id: userId,
      title,
      description,
      category,
      urgency: urgency ?? "normal",
      pickup_address: pickupLocation?.address,
      delivery_address: deliveryLocation?.address,
      pickup_lat: pickupLocation?.lat,
      pickup_lng: pickupLocation?.lng,
      delivery_lat: deliveryLocation?.lat,
      delivery_lng: deliveryLocation?.lng,
      base_fee: pricing.baseFee,
      distance_fee: pricing.distanceFee,
      urgency_fee: pricing.urgencyFee,
      category_fee: pricing.categoryFee,
      total_fee: pricing.totalFee,
      status: "posted",
    })
    .select()
    .single();

  return NextResponse.json({ job });
}
