import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import {
  type BackendErrand,
  clientCategoryToBackend,
  clientUrgencyToBackend,
  toClientJob,
} from "@/lib/graphql/adapters";
import {
  AVAILABLE_ERRANDS,
  CREATE_ERRAND,
  MY_POSTED_ERRANDS,
  MY_RUNNER_ERRANDS,
} from "@/lib/graphql/operations";
import { ghsToPesewas } from "@/lib/money";
import { calculatePricing } from "@/lib/pricing";
import type { JobCategory, UrgencyLevel } from "@/types";
import { getServerUser } from "@/lib/user";

/**
 * Job feed. `mine=true` returns the caller's requested + accepted errands
 * combined; otherwise we return the public backlog of available errands.
 * The client contract stays snake_case-free `Job[]` — adapter handles the
 * pesewas ↔ cedis and enum translation.
 */
export async function GET(request: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ jobs: [] }, { status: 401 });

  const url = new URL(request.url);
  const mine = url.searchParams.get("mine") === "true";

  try {
    if (mine) {
      const [posted, running] = await Promise.all([
        gqlRequest<{ myPostedErrands: BackendErrand[] }>(MY_POSTED_ERRANDS),
        gqlRequest<{ myRunnerErrands: BackendErrand[] }>(MY_RUNNER_ERRANDS),
      ]);
      const merged = [...posted.myPostedErrands, ...running.myRunnerErrands];
      return NextResponse.json({ jobs: merged.map(toClientJob) });
    }
    const data = await gqlRequest<{ availableErrands: BackendErrand[] }>(
      AVAILABLE_ERRANDS,
    );
    return NextResponse.json({ jobs: data.availableErrands.map(toClientJob) });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message ?? "Failed to load jobs" },
      { status: be.kind === "unauthenticated" ? 401 : 500 },
    );
  }
}

/**
 * Creates a new errand. Client sends decimal cedis + snake_case enum values
 * (legacy contract); we compute pesewas + backend enum values before
 * calling the mutation.
 */
export async function POST(request: Request) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    category?: JobCategory;
    urgency?: UrgencyLevel;
    pickupLocation?: { lat: number; lng: number; address: string };
    deliveryLocation?: { lat: number; lng: number; address: string };
    distanceKm?: number;
  };

  const category = body.category ?? "general_errands";
  const urgency = body.urgency ?? "normal";
  const pricing = calculatePricing(body.distanceKm ?? 1.5, urgency, category);

  const input = {
    title: body.title ?? "Untitled errand",
    category: clientCategoryToBackend[category],
    description: body.description ?? null,
    pickupLat: body.pickupLocation?.lat ?? null,
    pickupLng: body.pickupLocation?.lng ?? null,
    deliveryLat: body.deliveryLocation?.lat ?? null,
    deliveryLng: body.deliveryLocation?.lng ?? null,
    pickupAddress: body.pickupLocation?.address ?? null,
    deliveryAddress: body.deliveryLocation?.address ?? null,
    urgency: clientUrgencyToBackend[urgency],
    baseFee: ghsToPesewas(pricing.baseFee),
    distanceFee: ghsToPesewas(pricing.distanceFee),
    urgencyFee: ghsToPesewas(pricing.urgencyFee),
    categoryFee: ghsToPesewas(pricing.categoryFee),
    totalFee: ghsToPesewas(pricing.totalFee),
    expiresAt: null,
  };

  try {
    const data = await gqlRequest<{ createErrand: BackendErrand }>(
      CREATE_ERRAND,
      { input },
    );
    return NextResponse.json({ job: toClientJob(data.createErrand) });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      {
        error: be.message ?? "Failed to create job",
        kind: be.kind ?? "internal",
      },
      { status: be.kind === "validation" ? 400 : 500 },
    );
  }
}
