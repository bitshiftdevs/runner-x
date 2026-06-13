import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// For MVP, notifications are generated from recent activity
// In production, these would be stored in their own table
export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId) return NextResponse.json({ notifications: [] }, { status: 401 });

  // Return empty for now — notifications will come from job events
  return NextResponse.json({ notifications: [] });
}
