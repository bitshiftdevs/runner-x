import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { action } = body as { action: "approve" | "reject" };

  if (action === "approve") {
    await db.update(profiles).set({ studentIdVerified: true }).where(eq(profiles.id, id));
  } else if (action === "reject") {
    await db.update(profiles).set({ studentIdUrl: null }).where(eq(profiles.id, id));
  }

  return NextResponse.json({ success: true });
}
