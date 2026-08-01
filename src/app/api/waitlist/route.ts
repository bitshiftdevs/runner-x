import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import { type BackendError } from "@/lib/gql-errors";
import {
  JOIN_WAITLIST,
  type JoinWaitlistData,
  type WaitlistPlatform,
} from "@/lib/graphql/waitlist";

const ALLOWED_PLATFORMS: WaitlistPlatform[] = ["web", "ios", "android"];

/**
 * Records a waitlist lead against the custom backend. The mutation is
 * idempotent by (email, platform), so posting the same pair twice is a
 * silent no-op returning `joined: false`.
 */
export async function POST(request: Request) {
  let body: { email?: string; platform?: string };
  try {
    body = (await request.json()) as {
      email?: string;
      platform?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const platform = body.platform as WaitlistPlatform | undefined;

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  if (!platform || !ALLOWED_PLATFORMS.includes(platform)) {
    return NextResponse.json(
      { error: `platform must be one of ${ALLOWED_PLATFORMS.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const data = await gqlRequest<JoinWaitlistData>(JOIN_WAITLIST, {
      email,
      platform,
    });
    return NextResponse.json({ joined: data.joinWaitlist });
  } catch (err) {
    const be = err as BackendError;
    // Bad email format bubbles up as a validation error — surface it as 400
    // so the modal can show a helpful message rather than a generic failure.
    if (be.kind === "validation") {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
          kind: "validation",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: be.message ?? "Could not join the waitlist",
        kind: be.kind ?? "internal",
      },
      { status: 500 },
    );
  }
}
