import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { action } = body as { action: "resolve" };

  if (action === "resolve") {
    await db.update(jobs).set({ status: "completed" }).where(eq(jobs.id, id));
  }

  return NextResponse.json({ success: true });
}
