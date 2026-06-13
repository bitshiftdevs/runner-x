import { NextResponse } from "next/server";

export async function POST() {
  // In production, mark all notifications as read in DB
  return NextResponse.json({ success: true });
}
