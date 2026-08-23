import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import { JOIN_WAITLIST, type JoinWaitlistData } from "@/lib/graphql/waitlist";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      platform?: string;
    };

    if (!body.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const platform = (body.platform ?? "ios") as "ios" | "android" | "web";

    await gqlRequest<JoinWaitlistData>(JOIN_WAITLIST, {
      email: body.email,
      platform,
    });

    return NextResponse.json({ joined: true });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message ?? "Failed to join waitlist" },
      { status: 500 },
    );
  }
}
