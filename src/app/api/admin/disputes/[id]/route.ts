import { NextResponse } from "next/server";
import { db } from "@/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { action } = (await request.json()) as { action: "resolve" };

  if (action === "resolve") {
    await db.from("jobs").update({ status: "confirmed" }).eq("id", id);
  }

  return NextResponse.json({ success: true });
}
