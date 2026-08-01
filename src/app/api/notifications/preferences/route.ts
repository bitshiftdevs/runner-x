import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import {
  type BackendNotifPrefs,
  toClientNotifPrefs,
} from "@/lib/graphql/adapters";
import {
  MY_NOTIFICATION_PREFERENCES,
  UPDATE_NOTIFICATION_PREFERENCES,
} from "@/lib/graphql/operations";
import { getServerUser } from "@/lib/user";

export async function GET() {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ preferences: null }, { status: 401 });
  }
  try {
    const data = await gqlRequest<{
      myNotificationPreferences: BackendNotifPrefs;
    }>(MY_NOTIFICATION_PREFERENCES);
    return NextResponse.json({
      preferences: toClientNotifPrefs(data.myNotificationPreferences, user.id),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { preferences: null, error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 500 },
    );
  }
}

/**
 * The client sends `notifyFoodJobs` etc.; translate back to the backend's
 * `notifyFoodErrands` naming before firing the mutation.
 */
export async function PATCH(request: Request) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, boolean | undefined>;
  const input: Record<string, boolean> = {};
  const map: Record<string, string> = {
    pushEnabled: "pushEnabled",
    smsEnabled: "smsEnabled",
    notifyFoodJobs: "notifyFoodErrands",
    notifyAcademicJobs: "notifyAcademicErrands",
    notifyDeliveryJobs: "notifyDeliveryErrands",
    notifyGeneralJobs: "notifyGeneralErrands",
    notifyJobAccepted: "notifyErrandAccepted",
    notifyJobStatusChange: "notifyErrandStatusChange",
    notifyJobCompleted: "notifyErrandCompleted",
    notifyJobCancelled: "notifyErrandCancelled",
    notifyPaymentReceived: "notifyPaymentReceived",
    notifyPromotions: "notifyPromotions",
  };
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "boolean" && map[k]) input[map[k]] = v;
  }
  try {
    const data = await gqlRequest<{
      updateNotificationPreferences: BackendNotifPrefs;
    }>(UPDATE_NOTIFICATION_PREFERENCES, { input });
    return NextResponse.json({
      preferences: toClientNotifPrefs(
        data.updateNotificationPreferences,
        user.id,
      ),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "validation" ? 400 : 500 },
    );
  }
}
