import { NextResponse } from "next/server";
import { db } from "@/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { action } = (await request.json()) as { action: "approve" | "reject" };

  if (action === "approve") {
    await db.from("profiles").update({ student_id_status: "approved" }).eq("id", id);
  } else if (action === "reject") {
    await db.from("profiles").update({ student_id_status: "rejected" }).eq("id", id);
  }

  return NextResponse.json({ success: true });
}
