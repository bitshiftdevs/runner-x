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
  ERRANDS_CONNECTION,
  CREATE_ERRAND,
} from "@/lib/graphql/operations";
import { ghsToPesewas } from "@/lib/money";
import { calculatePricing } from "@/lib/pricing";
import type { JobCategory, UrgencyLevel } from "@/types";
import { getServerUser } from "@/lib/user";

type ErrandEdge = { node: BackendErrand; cursor: string };
type ErrandsResponse = {
  errands: {
    edges: ErrandEdge[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    totalCount: number | null;
  };
};

/**
 * Job feed. `mine=true` returns the caller's requested + accepted errands
 * combined; otherwise we return the public backlog of available errands.
 * Supports cursor-based pagination via `after` and `first` query params.
 */
export async function GET(request: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ jobs: [] }, { status: 401 });

  const url = new URL(request.url);
  const mine = url.searchParams.get("mine") === "true";
  const after = url.searchParams.get("after") ?? undefined;
  const first = url.searchParams.get("first")
    ? Number.parseInt(url.searchParams.get("first")!, 10)
    : 20;

  try {
    if (mine) {
      // Fetch both posted and runner errands using the unified query
      const [posted, running] = await Promise.all([
        gqlRequest<ErrandsResponse>(ERRANDS_CONNECTION, {
          filter: { role: "MY_POSTED" },
          first,
          after,
        }),
        gqlRequest<ErrandsResponse>(ERRANDS_CONNECTION, {
          filter: { role: "MY_RUNS" },
          first,
          after,
        }),
      ]);
      const postedJobs = posted.errands.edges.map((e) => toClientJob(e.node));
      const runningJobs = running.errands.edges.map((e) => toClientJob(e.node));
      const merged = [...postedJobs, ...runningJobs];
      return NextResponse.json({
        jobs: merged,
        pageInfo: {
          hasNextPage:
            posted.errands.pageInfo.hasNextPage ||
            running.errands.pageInfo.hasNextPage,
        },
      });
    }

    const data = await gqlRequest<ErrandsResponse>(ERRANDS_CONNECTION, {
      filter: { role: "AVAILABLE" },
      first,
      after,
    });
    return NextResponse.json({
      jobs: data.errands.edges.map((e) => toClientJob(e.node)),
      pageInfo: data.errands.pageInfo,
    });
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
