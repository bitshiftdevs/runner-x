import { NextResponse } from "next/server";

import { getServerUser } from "@/lib/user";

/**
 * Placeholder — the backend does not yet persist per-user notifications;
 * the mobile client relies on FCM push. When a `Notification` table lands,
 * swap the empty array for a `myNotifications` GraphQL query.
 */
export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ notifications: [] }, { status: 401 });
  return NextResponse.json({ notifications: [] });
}
